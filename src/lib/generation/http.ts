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

type SsePosition = { lastEventId: number };

/**
 * Reads one SSE response to completion.
 *
 * Returns null when the connection ended before the job did — that is a
 * resumable drop, not a failure, so it is the caller's cue to reattach from
 * `position.lastEventId` rather than start over.
 */
async function consumeSse(
  response: Response,
  onEvent: (event: GenerationStreamEvent) => void,
  position: SsePosition,
  signal?: AbortSignal,
): Promise<StreamResult | null> {
  if (!response.ok || !response.body) {
    const text = await response.text();
    throw new Error(`Generation failed (${response.status}): ${text}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult: StreamResult | null = null;

  const abort = () => {
    void reader.cancel();
  };
  signal?.addEventListener("abort", abort, { once: true });

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";
      for (const chunk of chunks) {
        const lines = chunk.split("\n");
        let eventName = "message";
        const dataLines: string[] = [];
        for (const line of lines) {
          if (line.startsWith("id:")) {
            const id = Number.parseInt(line.slice(3).trim(), 10);
            if (Number.isFinite(id)) position.lastEventId = id;
          }
          if (line.startsWith("event:")) eventName = line.slice(6).trim();
          if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
        }
        if (!dataLines.length) continue;
        const payload = JSON.parse(dataLines.join("\n")) as Record<string, unknown>;
        if (eventName === "result" || payload.type === "result") {
          finalResult = (payload.result ?? payload) as StreamResult;
          continue;
        }
        if (
          payload.type === "stage" ||
          payload.type === "progress" ||
          payload.type === "allowance"
        ) {
          onEvent(payload as GenerationStreamEvent);
        }
      }
    }
  } finally {
    signal?.removeEventListener("abort", abort);
  }

  return finalResult;
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
  const response = await fetch(startPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
    credentials: "same-origin",
  });
  const jobId = response.headers.get(JOB_ID_HEADER);
  const position: SsePosition = { lastEventId: 0 };

  let result = await consumeSse(response, onEvent, position, signal);
  if (result) return result;

  if (!jobId) {
    throw new Error("Generation stream ended without a result");
  }

  for (let attempt = 0; attempt < MAX_RESUME_ATTEMPTS; attempt += 1) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    await waitBeforeResume(attempt, signal);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    let resumed: Response;
    try {
      resumed = await fetch(
        `/api/generation/jobs/${encodeURIComponent(jobId)}/events?lastEventId=${position.lastEventId}`,
        { signal, credentials: "same-origin" },
      );
    } catch (error) {
      if (signal?.aborted) throw error;
      continue;
    }

    try {
      result = await consumeSse(resumed, onEvent, position, signal);
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
