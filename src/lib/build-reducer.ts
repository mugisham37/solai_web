import type {
  BuildScreenState,
  BuildState,
  Draft,
  GenerationStageStatus,
  UploadingFile,
} from "@/types/build";

export type BuildAction =
  | { type: "SET_DESCRIPTION"; description: string }
  | { type: "ACCEPT_FILES"; files: UploadingFile[] }
  | { type: "UPDATE_FILE"; file: UploadingFile }
  | { type: "START_UPLOADING"; descriptionOnly?: boolean }
  | { type: "START_GENERATING"; allowanceRemaining: number }
  | { type: "UPDATE_GENERATION"; stages: GenerationStageStatus[]; progress: number }
  | { type: "GENERATION_COMPLETE"; draft: Draft }
  | {
      type: "GENERATION_UNCLEAR";
      imageUrl: string;
      issues: readonly string[];
    }
  | { type: "GENERATION_BLOCKED"; reason: string; rule: string }
  | {
      type: "GENERATION_ERROR";
      message: string;
      canRetry: boolean;
      chargedAllowance: boolean;
    }
  | { type: "SET_UNCLEAR_HINT"; hint: string }
  | { type: "UPDATE_DRAFT"; draft: Draft }
  | { type: "GO_CAPTURE" }
  | { type: "RESTORE_SESSION"; buildState: BuildState; allowanceRemaining?: number };

export type BuildReducerState = Readonly<{
  buildState: BuildState;
  allowanceRemaining: number;
}>;

export function buildStateToScreen(state: BuildState): BuildScreenState {
  return state.state;
}

export function screenToHash(state: BuildScreenState): string {
  return state;
}

export function hashToScreen(hash: string): BuildScreenState | null {
  const valid: BuildScreenState[] = [
    "capture",
    "uploading",
    "generating",
    "draft",
    "unclear",
    "blocked",
    "error",
  ];
  if (valid.includes(hash as BuildScreenState)) {
    return hash as BuildScreenState;
  }
  return null;
}

export function buildReducer(
  prev: BuildReducerState,
  action: BuildAction,
): BuildReducerState {
  switch (action.type) {
    case "RESTORE_SESSION":
      return {
        buildState: action.buildState,
        allowanceRemaining: action.allowanceRemaining ?? prev.allowanceRemaining,
      };
    case "SET_DESCRIPTION":
      if (prev.buildState.state !== "capture") return prev;
      return {
        ...prev,
        buildState: { state: "capture", description: action.description },
      };
    case "ACCEPT_FILES":
      return {
        ...prev,
        buildState: {
          state: "uploading",
          files: action.files,
          canStartGeneration: false,
        },
      };
    case "UPDATE_FILE": {
      if (prev.buildState.state !== "uploading") {
        return {
          ...prev,
          buildState: {
            state: "uploading",
            files: [action.file],
            canStartGeneration: action.file.status === "done",
          },
        };
      }
      const exists = prev.buildState.files.some((f) => f.id === action.file.id);
      const files = exists
        ? prev.buildState.files.map((f) => (f.id === action.file.id ? action.file : f))
        : [...prev.buildState.files, action.file];
      const anyDone = files.some((f) => f.status === "done");
      return {
        ...prev,
        buildState: {
          ...prev.buildState,
          files,
          canStartGeneration: anyDone,
        },
      };
    }
    case "START_UPLOADING":
      return {
        ...prev,
        buildState: {
          state: "uploading",
          files: [],
          canStartGeneration: false,
          descriptionOnly: action.descriptionOnly,
        },
      };
    case "START_GENERATING":
      return {
        ...prev,
        allowanceRemaining: action.allowanceRemaining,
        buildState: {
          state: "generating",
          stages: [],
          progress: 0,
          allowanceRemaining: action.allowanceRemaining,
        },
      };
    case "UPDATE_GENERATION":
      if (prev.buildState.state !== "generating") return prev;
      return {
        ...prev,
        buildState: {
          ...prev.buildState,
          stages: action.stages,
          progress: action.progress,
        },
      };
    case "GENERATION_COMPLETE":
      return {
        ...prev,
        buildState: { state: "draft", draft: action.draft },
      };
    case "GENERATION_UNCLEAR":
      return {
        ...prev,
        buildState: {
          state: "unclear",
          imageUrl: action.imageUrl,
          issues: action.issues,
          hint: "",
        },
      };
    case "GENERATION_BLOCKED":
      return {
        ...prev,
        buildState: {
          state: "blocked",
          reason: action.reason,
          rule: action.rule,
          options: [
            { id: "1", labelKey: "build.blocked.optionSecondHand", action: "second-hand" },
            { id: "2", labelKey: "build.blocked.optionProof", action: "proof" },
            { id: "3", labelKey: "build.blocked.optionOther", action: "other" },
          ],
        },
      };
    case "GENERATION_ERROR":
      return {
        ...prev,
        buildState: {
          state: "error",
          message: action.message,
          canRetry: action.canRetry,
          chargedAllowance: action.chargedAllowance,
        },
      };
    case "SET_UNCLEAR_HINT":
      if (prev.buildState.state !== "unclear") return prev;
      return {
        ...prev,
        buildState: { ...prev.buildState, hint: action.hint },
      };
    case "UPDATE_DRAFT":
      return {
        ...prev,
        buildState: { state: "draft", draft: action.draft },
      };
    case "GO_CAPTURE":
      return {
        ...prev,
        buildState: { state: "capture" },
      };
    default:
      return prev;
  }
}

export function canDeleteImage(
  draft: Draft,
  imageId: string,
): boolean {
  if (imageId === draft.images.original.id) return false;
  return true;
}

export function removeGeneratedImage(draft: Draft, imageId: string): Draft | null {
  if (!canDeleteImage(draft, imageId)) return null;
  const generated = draft.images.generated.filter((g) => g.id !== imageId);
  let coverImageId = draft.coverImageId;
  if (coverImageId === imageId) {
    coverImageId = draft.images.original.id;
  }
  return {
    ...draft,
    coverImageId,
    images: { ...draft.images, generated },
    updatedAt: new Date().toISOString(),
  };
}

export function orderedGalleryImages(draft: Draft) {
  const originals = [draft.images.original, ...draft.images.additionalOriginals].sort(
    (a, b) => a.galleryOrder - b.galleryOrder,
  );
  const generated = [...draft.images.generated].sort((a, b) => a.galleryOrder - b.galleryOrder);
  return [...originals, ...generated];
}

export function buyerGalleryFirstId(draft: Draft): string {
  return draft.images.original.id;
}
