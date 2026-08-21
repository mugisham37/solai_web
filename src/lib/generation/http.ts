import { SSE, type SSEvent, type ReadyStateEvent } from "sse.js";
import { JOB_ID_HEADER } from "@/lib/generation/protocol";
import type {
  AnalyseAndBuildResult,
  GenerationService,
  GenerationStreamEvent,
  RegenerateScenesInput,
  RewriteDescriptionInput,
  RewriteDescriptionResult,
} from "@/types/generation";
import type { DraftGeneratedImage } from "@/types/build";

type SceneResult = { images: DraftGeneratedImage[]; allowanceRemaining: number };
type StreamResult = AnalyseAndBuildResult | SceneResult;

/** A generation runs for tens of seconds on a phone that may change network
 * two or three times; give up only after the job itself has had a fair chance. */
const MAX_RESUME_ATTEMPTS = 6;
const RESUME_BASE_DELAY_MS = 400;
const RESUME_MAX_DELAY_MS = 5000;

const GENERATION_EVENT_TYPES = ["stage", "progress", "allowance"] as const;

type SsePosition = { lastEventId: number };

/**
 * Opens one SSE connection and follows it to completion.
 *
 * Returns null when the connection ended before the job did — that is a
 * resumable drop, not a failure, so it is the caller's cue to reattach from
 * `position.lastEventId` rather than start over. sse.js's own autoReconnect
 * stays off deliberately: it only knows how to retry the same URL, but a
 * resumed generation must move to a different one
 * (/jobs/{jobId}/events?lastEventId=...) — that resume decision belongs to
 * streamGeneration's own loop below, not this function.
 *
 * sse.js has no public "stream finished successfully" event — its internal
 * `_onStreamLoaded` runs off the raw XHR "load" event and never redispatches
 * through its own `addEventListener`. The one signal that reliably covers
 * both a clean finish and a server-side error is the readystatechange
 * transition to CLOSED, so completion is detected off that instead.
 */
function consumeSse(
  url: string,
  init: { method: "GET" | "POST"; body?: string },
  onEvent: (event: GenerationStreamEvent) => void,
  position: SsePosition,
  signal?: AbortSignal,
  onJobId?: (jobId: string) => void,
): Promise<StreamResult | null> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const source = new SSE(url, {
      method: init.method,
      payload: init.body,
      headers: init.body ? { "Content-Type": "application/json" } : undefined,
      withCredentials: true,
      autoReconnect: false,
    });

    let finalResult: StreamResult | null = null;
    let settled = false;

    const finish = (value: StreamResult | null) => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", onAbort);
      source.close();
      resolve(value);
    };
    const onAbort = () => {
      if (settled) return;
      settled = true;
      source.close();
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });

    if (onJobId) {
      source.addEventListener("readystatechange", (event: ReadyStateEvent) => {
        if (event.readyState === SSE.OPEN && source.xhr) {
          const header = source.xhr.getResponseHeader(JOB_ID_HEADER);
          if (header) onJobId(header);
        }
      });
    }

    for (const type of GENERATION_EVENT_TYPES) {
      source.addEventListener(type, (event: SSEvent) => {
        if (event.id) {
          const id = Number.parseInt(event.id, 10);
          if (Number.isFinite(id)) position.lastEventId = id;
        }
        try {
          onEvent(JSON.parse(event.data) as GenerationStreamEvent);
        } catch {
          // Malformed frame — skip rather than tear down the whole stream.
        }
      });
    }
    source.addEventListener("result", (event: SSEvent) => {
      if (event.id) {
        const id = Number.parseInt(event.id, 10);
        if (Number.isFinite(id)) position.lastEventId = id;
      }
      try {
        const payload = JSON.parse(event.data) as Record<string, unknown>;
        finalResult = (payload.result ?? payload) as StreamResult;
      } catch {
        // Fall through to the readystatechange handler with finalResult still null.
      }
    });
    source.addEventListener("readystatechange", (event: ReadyStateEvent) => {
      if (event.readyState === SSE.CLOSED) finish(finalResult);
    });
    source.addEventListener("error", () => finish(finalResult));

    source.stream();
  });
}

/** Waits out the backoff, but cuts it short the moment the tab comes back or
 * the network returns — the two events that make a retry worth trying. */
function waitBeforeResume(attempt: number, signal?: AbortSignal): Promise<void> {
  const delay = Math.min(RESUME_BASE_DELAY_MS * 2 ** attempt, RESUME_MAX_DELAY_MS);
  return new Promise<void>((resolve) => {
    const onVisible = () => {
      if (document.visibilityState === "visible") finish();
    };
    const finish = () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", finish);
      signal?.removeEventListener("abort", finish);
      resolve();
    };
    const timer = setTimeout(finish, delay);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", finish);
    signal?.addEventListener("abort", finish, { once: true });
  });
}

/**
 * Starts a generation and keeps following it across dropped connections.
 *
 * The job lives on the server; this only owns the connection to it. So when
 * the connection dies the work continues and we reattach by job id, which is
 * why a seller who locks their phone mid-generation comes back to a finished
 * draft instead of a spinner and a spent allowance.
 */
async function streamGeneration(
  startPath: string,
  body: unknown,
  onEvent: (event: GenerationStreamEvent) => void,
  signal?: AbortSignal,
): Promise<StreamResult> {
  const position: SsePosition = { lastEventId: 0 };
  let jobId: string | null = null;

  const firstResult = await consumeSse(
    startPath,
    { method: "POST", body: JSON.stringify(body) },
    onEvent,
    position,
    signal,
    (id) => {
      jobId = id;
    },
  );

  if (firstResult) return firstResult;
  if (!jobId) {
    throw new Error("Generation stream ended without a result");
  }

  for (let attempt = 0; attempt < MAX_RESUME_ATTEMPTS; attempt += 1) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    await waitBeforeResume(attempt, signal);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    let result: StreamResult | null;
    try {
      result = await consumeSse(
        `/api/generation/jobs/${encodeURIComponent(jobId)}/events?lastEventId=${position.lastEventId}`,
        { method: "GET" },
        onEvent,
        position,
        signal,
      );
    } catch (error) {
      if (signal?.aborted) throw error;
      continue;
    }
    if (result) return result;
  }

  throw new Error("Generation stream ended without a result");
}

export const httpGenerationService: GenerationService = {
  async analyseAndBuild(input, onEvent, signal) {
    const result = await streamGeneration("/api/generation/analyse", input, onEvent, signal);
    return result as AnalyseAndBuildResult;
  },

  async regenerateScenes(input: RegenerateScenesInput, onEvent, signal) {
    const result = await streamGeneration("/api/generation/scenes", input, onEvent, signal);
    return result as SceneResult;
  },

  async rewriteDescription(
    input: RewriteDescriptionInput,
    signal?: AbortSignal,
  ): Promise<RewriteDescriptionResult> {
    const res = await fetch("/api/generation/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal,
      credentials: "same-origin",
    });
    if (!res.ok) {
      throw new Error(`Rewrite failed (${res.status})`);
    }
    return (await res.json()) as RewriteDescriptionResult;
  },
};

/** Prefer real backend when SOLAI_USE_HTTP_GENERATION is not explicitly "0". */
export function shouldUseHttpGeneration(): boolean {
  return process.env.NEXT_PUBLIC_SOLAI_USE_HTTP_GENERATION !== "0";
}
