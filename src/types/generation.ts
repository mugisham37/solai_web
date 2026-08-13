import type { AspectRatio, Draft, DraftGeneratedImage, SceneStyle, Tone } from "@/types/build";

export type GenerationStageEvent = Readonly<{
  type: "stage";
  stageId: string;
  label: string;
  subLabel: string;
  index: number;
  total: number;
}>;

export type GenerationProgressEvent = Readonly<{
  type: "progress";
  progress: number;
}>;

export type GenerationAllowanceEvent = Readonly<{
  type: "allowance";
  remaining: number;
}>;

export type GenerationStreamEvent =
  | GenerationStageEvent
  | GenerationProgressEvent
  | GenerationAllowanceEvent;

export type AnalyseAndBuildInput = Readonly<{
  imageUrls: readonly string[];
  hint?: string;
  descriptionOnly?: boolean;
  /** When calling a real backend, scopes the job to this draft session. */
  draftId?: string;
}>;

export type AnalyseAndBuildResult =
  | { outcome: "draft"; draft: Draft; allowanceRemaining: number }
  | {
      outcome: "unclear";
      imageUrl: string;
      issues: readonly string[];
    }
  | { outcome: "blocked"; reason: string; rule: string }
  | { outcome: "error"; message: string; chargedAllowance: boolean };

export type RegenerateScenesInput = Readonly<{
  draft: Draft;
  sceneStyles: readonly SceneStyle[];
  aspectRatio: AspectRatio;
}>;

export type RewriteDescriptionInput = Readonly<{
  draft: Draft;
  tone: Tone;
  locale: string;
}>;

export type RewriteDescriptionResult = Readonly<{
  description: Record<string, string>;
  allowanceRemaining: number;
}>;

export type GenerationService = Readonly<{
  analyseAndBuild: (
    input: AnalyseAndBuildInput,
    onEvent: (event: GenerationStreamEvent) => void,
    signal?: AbortSignal,
  ) => Promise<AnalyseAndBuildResult>;
  regenerateScenes: (
    input: RegenerateScenesInput,
    onEvent: (event: GenerationStreamEvent) => void,
    signal?: AbortSignal,
  ) => Promise<{ images: readonly DraftGeneratedImage[]; allowanceRemaining: number }>;
  rewriteDescription: (
    input: RewriteDescriptionInput,
    signal?: AbortSignal,
  ) => Promise<RewriteDescriptionResult>;
}>;
