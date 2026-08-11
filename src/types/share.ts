import type { CurrencyCode } from "@/types/money";

/** Sharing has exactly three outcomes. Anything else is a state we invented. */
export type ShareScreenState = "share" | "done" | "error";

/**
 * The two languages come from the generation service together. Runtime machine
 * translation is never acceptable here: this text goes out under the seller's
 * name to people who know them.
 */
export type CaptionLanguage = "en" | "rw";

export type CaptionTone = "friendly" | "short" | "offer";

export type CaptionSet = Readonly<Record<CaptionLanguage, Readonly<Record<CaptionTone, string>>>>;

/**
 * Every surface a shop link can leave through. `ig` opens the hand-off sheet
 * rather than a composer, because no third-party app may post to Instagram.
 */
export type ShareChannel =
  | "wa"
  | "story"
  | "fb"
  | "ig"
  | "tg"
  | "x"
  | "sms"
  | "mail"
  | "link"
  | "qr"
  | "more";

export type ShareProductSummary = Readonly<{
  title: string;
  priceMinor: number;
  currency: CurrencyCode;
}>;

export type ShareSummary = Readonly<{
  shopName: string;
  shopSlug: string;
  /** Absolute, canonical URL. The only string the QR ever encodes. */
  shopUrl: string;
  /** Display form of the link, used inside captions and drawn onto images. */
  shopHost: string;
  city: string;
  product: ShareProductSummary;
  /** Authored by the generation service in both languages, three tones each. */
  captions: CaptionSet;
}>;

/** The five prompts, in the order they are easiest to act on. */
export const CHECKLIST_IDS = ["family", "customer", "group", "reposter", "status"] as const;

export type ChecklistId = (typeof CHECKLIST_IDS)[number];

export type ChecklistState = Readonly<Record<ChecklistId, boolean>>;

export const EMPTY_CHECKLIST: ChecklistState = {
  family: false,
  customer: false,
  group: false,
  reposter: false,
  status: false,
};

export type ShareState =
  | { state: "share"; summary: ShareSummary; checklist: ChecklistState }
  | { state: "done"; summary: ShareSummary; checklist: ChecklistState }
  /** Carries the summary so "copy the link instead" still has a link to copy. */
  | { state: "error"; summary: ShareSummary | null; message: string };

/* ---- share service contract ---- */

export type ShareData = Readonly<{
  summary: ShareSummary;
  checklist: ChecklistState;
}>;

export type ShareService = Readonly<{
  /** Throws if the shop is not published yet; the screen has nothing to share. */
  getShareData(draftId: string): Promise<ShareData>;
  /**
   * Persisted per shop, server-side, because it is a genuinely useful day-two
   * prompt: you told three people, who are the other two?
   */
  setChecklistItem(draftId: string, id: ChecklistId, checked: boolean): Promise<ChecklistState>;
}>;

/** Number of prompts in the first-five list; the copy says "five" out loud. */
export const CHECKLIST_TOTAL = CHECKLIST_IDS.length;
