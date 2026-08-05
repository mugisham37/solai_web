import type { CurrencyCode } from "@/types/money";

/** Publishing has exactly three outcomes. Anything else is a state we invented. */
export type LiveScreenState = "publishing" | "live" | "error";

export type PublishStageStatus = "pending" | "active" | "done";

/** Labels come from the server; the client renders what it is told. */
export type PublishStage = Readonly<{
  id: string;
  label: string;
  status: PublishStageStatus;
}>;

export type LiveProductSummary = Readonly<{
  title: string;
  priceMinor: number;
  currency: CurrencyCode;
  stock: number;
  imageCount: number;
  madeToOrder: boolean;
}>;

export type LivePayoutSummary = Readonly<{
  railLabel: string;
  maskedIdentifier: string;
  holderName: string;
}>;

export type LiveSummary = Readonly<{
  shopName: string;
  shopSlug: string;
  /** Absolute, canonical URL. The only string the QR ever encodes. */
  shopUrl: string;
  product: LiveProductSummary;
  payout: LivePayoutSummary;
  /** Exactly one free slug change is allowed, and the screen says so. */
  slugChangesRemaining: number;
}>;

export type LiveState =
  | { state: "publishing"; stages: readonly PublishStage[]; progress: number }
  | { state: "live"; summary: LiveSummary }
  | { state: "error"; message: string };

/* ---- publish service contract ---- */

/**
 * Publishing runs as a server-side job the client polls. That is what lets it
 * survive the seller backgrounding the tab: the job advances on wall clock,
 * independent of whether anyone is watching.
 */
export type PublishStatus =
  | { phase: "running"; stages: readonly PublishStage[]; progress: number }
  | { phase: "done"; summary: LiveSummary }
  /**
   * Publishing is transactional, so a failure means nothing was written.
   * The error copy on screen depends on this being true.
   */
  | { phase: "failed"; message: string };

export type SlugCheckResult =
  | { available: true }
  | { available: false; reason: "taken" | "reserved" | "invalid"; suggestions: readonly string[] };

export type SlugChangeResult =
  | { ok: true; slug: string; shopUrl: string }
  | { ok: false; reason: "taken" | "reserved" | "invalid" | "no-changes-left"; message: string };

export type PublishService = Readonly<{
  /** Idempotent: calling it for an in-flight or finished job returns current status. */
  startPublish(draftId: string): Promise<PublishStatus>;
  getPublishStatus(draftId: string): Promise<PublishStatus>;
  checkSlug(draftId: string, slug: string): Promise<SlugCheckResult>;
  changeSlug(draftId: string, nextSlug: string): Promise<SlugChangeResult>;
  /** Resolves any slug the shop has ever used, so retired links keep working. */
  resolveSlug(slug: string): Promise<string | null>;
}>;

/** Poll cadence while the publish job is running. */
export const PUBLISH_POLL_MS = 400;

export const SLUG_MIN_LENGTH = 3;
/** Longer than this is unmemorable, which is the real failure mode. */
export const SLUG_MAX_LENGTH = 30;
export const SLUG_FREE_CHANGES = 1;
