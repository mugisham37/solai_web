import type { CategoryLabel } from "@/types/category";
import type { CurrencyCode } from "@/types/money";

export type ImageKind = "original" | "generated";

export type ProvenanceMetadata = Readonly<{
  generator: string;
  model: string;
  timestamp: string;
  parameters: Record<string, unknown>;
  c2paManifest?: string;
  signature: string;
}>;

export type DraftOriginalImage = Readonly<{
  id: string;
  kind: "original";
  locked: true;
  url: string;
  thumbnailUrl: string;
  originalFileSize: number;
  compressedFileSize: number;
  fileName: string;
  exifApplied: boolean;
  galleryOrder: number;
}>;

export type DraftGeneratedImage = Readonly<{
  id: string;
  kind: "generated";
  locked: false;
  url: string;
  thumbnailUrl: string;
  sceneLabel: string;
  provenanceMetadata: ProvenanceMetadata;
  galleryOrder: number;
}>;

export type DraftImage = DraftOriginalImage | DraftGeneratedImage;

/** At least one original, primary locked — not a flat array. */
export type DraftImageCollection = Readonly<{
  original: DraftOriginalImage;
  additionalOriginals: readonly DraftOriginalImage[];
  generated: readonly DraftGeneratedImage[];
}>;

export type PriceConfidence = "high" | "medium" | "low";

export type PriceSuggestion = Readonly<{
  amountMinor: number;
  currency: CurrencyCode;
  confidence: PriceConfidence;
  comparisonCount: number;
  soldCount: number;
  medianMinor: number;
  closestMatchMinor: number;
  rangeLowMinor: number;
  rangeHighMinor: number;
  explanation: string;
  feeMinor: number;
  payoutMinor: number;
}>;

export type SceneStyle =
  | "clean-white"
  | "market-stall"
  | "on-the-wrist"
  | "flat-lay"
  | "outdoors-kigali"
  | "held-in-hand";

export type Tone = "plain" | "warm" | "short";

export type AspectRatio = "1:1" | "4:5";

export type Condition = "new" | "used-good" | "used-fair";

export type LocalizedText = Readonly<Record<string, string>>;

export type Draft = Readonly<{
  id: string;
  images: DraftImageCollection;
  title: LocalizedText;
  description: LocalizedText;
  price: PriceSuggestion;
  category: CategoryLabel;
  stock: number;
  madeToOrder: boolean;
  variants: readonly string[];
  condition: Condition;
  leadTimeDays: number;
  weightGrams: number;
  courierEnabled: boolean;
  pickupEnabled: boolean;
  coverImageId: string;
  sceneStyles: readonly SceneStyle[];
  aspectRatio: AspectRatio;
  createdAt: string;
  updatedAt: string;
}>;

export type UploadFileStatus =
  | "pending"
  | "processing"
  | "uploading"
  | "done"
  | "failed";

export type UploadingFile = Readonly<{
  id: string;
  fileName: string;
  status: UploadFileStatus;
  progress: number;
  originalFileSize: number;
  compressedFileSize?: number;
  previewUrl?: string;
  remoteUrl?: string;
  error?: string;
  retryCount: number;
}>;

export type GenerationStageStatus = Readonly<{
  id: string;
  label: string;
  subLabel: string;
  status: "pending" | "active" | "done";
}>;

export type BlockedOption = Readonly<{
  id: string;
  labelKey: string;
  action: "second-hand" | "proof" | "other";
}>;

export type BuildScreenState =
  | "capture"
  | "uploading"
  | "generating"
  | "draft"
  | "unclear"
  | "blocked"
  | "error";

export type BuildState =
  | { state: "capture"; description?: string }
  | {
      state: "uploading";
      files: readonly UploadingFile[];
      canStartGeneration: boolean;
      descriptionOnly?: boolean;
    }
  | {
      state: "generating";
      stages: readonly GenerationStageStatus[];
      progress: number;
      allowanceRemaining: number;
      cancelled?: boolean;
    }
  | { state: "draft"; draft: Draft }
  | {
      state: "unclear";
      imageUrl: string;
      issues: readonly string[];
      hint: string;
    }
  | {
      state: "blocked";
      reason: string;
      rule: string;
      options: readonly BlockedOption[];
    }
  | {
      state: "error";
      message: string;
      canRetry: boolean;
      chargedAllowance: boolean;
    };

export type AutosaveStatus = "saved" | "saving" | "offline";

export type BuildSession = Readonly<{
  draftId: string;
  buildState: BuildState;
  allowanceRemaining: number;
  autosaveStatus: AutosaveStatus;
  lastSavedAt?: string;
}>;
