import type {
  AnalyseAndBuildInput,
  AnalyseAndBuildResult,
  GenerationService,
  GenerationStreamEvent,
  RegenerateScenesInput,
  RewriteDescriptionInput,
  RewriteDescriptionResult,
} from "@/types/generation";
import type { DraftGeneratedImage } from "@/types/build";

async function consumeSse(
  response: Response,
  onEvent: (event: GenerationStreamEvent) => void,
  signal?: AbortSignal,
): Promise<AnalyseAndBuildResult | { images: DraftGeneratedImage[]; allowanceRemaining: number }> {
  if (!response.ok || !response.body) {
    const text = await response.text();
    throw new Error(`Generation failed (${response.status}): ${text}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult:
    | AnalyseAndBuildResult
    | { images: DraftGeneratedImage[]; allowanceRemaining: number }
    | null = null;

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
          if (line.startsWith("event:")) eventName = line.slice(6).trim();
          if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
        }
        if (!dataLines.length) continue;
        const payload = JSON.parse(dataLines.join("\n")) as Record<string, unknown>;
        if (eventName === "result" || payload.type === "result") {
          finalResult = (payload.result ?? payload) as AnalyseAndBuildResult;
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

  if (!finalResult) {
    throw new Error("Generation stream ended without a result");
  }
  return finalResult;
}

export const httpGenerationService: GenerationService = {
  async analyseAndBuild(input, onEvent, signal) {
    const res = await fetch("/api/generation/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal,
      credentials: "same-origin",
    });
    const result = await consumeSse(res, onEvent, signal);
    return result as AnalyseAndBuildResult;
  },

  async regenerateScenes(input: RegenerateScenesInput, onEvent, signal) {
    const res = await fetch("/api/generation/scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal,
      credentials: "same-origin",
    });
    const result = await consumeSse(res, onEvent, signal);
    return result as { images: DraftGeneratedImage[]; allowanceRemaining: number };
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
