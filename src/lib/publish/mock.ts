import { getDraftMemory } from "@/lib/draft-store";
import { isReservedSlug } from "@/lib/publish/reserved-slugs";
import { checkSlugShape, deriveSlugSuggestions, sanitiseSlug } from "@/lib/slug";
import { SLUG_FREE_CHANGES } from "@/types/live";
import type {
  LiveSummary,
  PublishService,
  PublishStage,
  PublishStatus,
  SlugChangeResult,
  SlugCheckResult,
} from "@/types/live";

/**
 * Stage labels live here, server-side. The client renders whatever it is handed
 * rather than keeping its own copy that can drift out of step.
 */
const STAGES = [
  { id: "reserve", label: "Reserving your link", ms: 900 },
  { id: "listing", label: "Publishing your listing", ms: 1000 },
  { id: "payments", label: "Turning on mobile money payments", ms: 900 },
  { id: "protection", label: "Switching on buyer protection", ms: 800 },
  { id: "qr", label: "Printing your QR code", ms: 700 },
] as const;

const TOTAL_MS = STAGES.reduce((sum, stage) => sum + stage.ms, 0);

export const SHOP_HOST = "https://solai.shop";

export function shopUrlForSlug(slug: string): string {
  return `${SHOP_HOST}/${slug}`;
}

type PublishJob = {
  startedAt: number;
  slug: string;
  /** Set once the sequence completes and the shop is committed. */
  summary?: LiveSummary;
  failure?: string;
};

type PublishedRecord = {
  summary: LiveSummary;
  /** Every slug this shop has ever had, so old links keep resolving. */
  slugHistory: string[];
};

const jobs = new Map<string, PublishJob>();
const published = new Map<string, PublishedRecord>();
/** slug -> draftId, including retired slugs. A printed flyer must never 404. */
const slugOwners = new Map<string, string>();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function deriveInitialSlug(draftId: string): string {
  const draft = getDraftMemory(draftId);
  const title = draft?.title.en ?? Object.values(draft?.title ?? {})[0] ?? "amara-beads";
  const base = sanitiseSlug(title.split(" ").slice(0, 2).join("-")) || "amara";
  const owner = slugOwners.get(base);
  if (!owner || owner === draftId) return base;
  let n = 2;
  while (slugOwners.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function summaryFromDraft(draftId: string, slug: string): LiveSummary {
  const draft = getDraftMemory(draftId);
  const title = draft?.title.en ?? Object.values(draft?.title ?? {})[0] ?? "Hand-strung beaded bracelet";
  const imageCount = draft
    ? 1 + draft.images.additionalOriginals.length + draft.images.generated.length
    : 1;

  // Prefer a memorable shop name derived from the listing title; strip a trailing
  // collision suffix (`-2`) so the display name stays human.
  const fromTitle = sanitiseSlug(title.split(" ").slice(0, 2).join("-"));
  const nameSource =
    fromTitle && fromTitle !== "shop" ? fromTitle : slug.replace(/-\d+$/, "") || "amara-beads";
  const shopName = titleCase(nameSource) || "Amara Beads";

  return {
    shopName,
    shopSlug: slug,
    shopUrl: shopUrlForSlug(slug),
    product: {
      title,
      priceMinor: draft?.price.amountMinor ?? 8500,
      currency: draft?.price.currency ?? "RWF",
      stock: draft?.stock ?? 12,
      imageCount: Math.max(imageCount, 6),
      madeToOrder: draft?.madeToOrder ?? true,
    },
    payout: {
      railLabel: "MTN Mobile Money",
      maskedIdentifier: "+250 788 ••• 456",
      holderName: "U. AMARA",
    },
    slugChangesRemaining: SLUG_FREE_CHANGES,
  };
}

/** Derive the visible stage list from elapsed wall-clock time. */
function stagesAt(elapsed: number): { stages: PublishStage[]; progress: number; complete: boolean } {
  const stages: PublishStage[] = [];
  let cursor = 0;

  for (const stage of STAGES) {
    const start = cursor;
    cursor += stage.ms;
    const status = elapsed >= cursor ? "done" : elapsed >= start ? "active" : "pending";
    stages.push({ id: stage.id, label: stage.label, status });
  }

  return {
    stages,
    progress: Math.min(100, Math.round((elapsed / TOTAL_MS) * 100)),
    complete: elapsed >= TOTAL_MS,
  };
}

function labelStages(stages: PublishStage[], slug: string): PublishStage[] {
  // The reserve step names the link it is claiming.
  return stages.map((stage) =>
    stage.id === "reserve" ? { ...stage, label: `Reserving solai.shop/${slug}` } : stage,
  );
}

function statusFor(draftId: string, job: PublishJob): PublishStatus {
  if (job.failure) return { phase: "failed", message: job.failure };

  const elapsed = Date.now() - job.startedAt;
  const { stages, progress, complete } = stagesAt(elapsed);

  if (!complete) {
    return { phase: "running", stages: labelStages(stages, job.slug), progress };
  }

  // Commit happens once, at the end, so a mid-sequence failure leaves no trace.
  if (!job.summary) {
    const existing = published.get(draftId);
    const summary = existing?.summary ?? summaryFromDraft(draftId, job.slug);
    published.set(draftId, {
      summary,
      slugHistory: existing?.slugHistory ?? [job.slug],
    });
    slugOwners.set(job.slug, draftId);
    job.summary = summary;
  }

  return { phase: "done", summary: job.summary };
}

export const mockPublishService: PublishService = {
  async startPublish(draftId) {
    const existing = published.get(draftId);
    if (existing) return { phase: "done", summary: existing.summary };

    const running = jobs.get(draftId);
    if (running && !running.failure) return statusFor(draftId, running);

    const job: PublishJob = { startedAt: Date.now(), slug: deriveInitialSlug(draftId) };
    jobs.set(draftId, job);
    return statusFor(draftId, job);
  },

  async getPublishStatus(draftId) {
    const existing = published.get(draftId);
    if (existing) return { phase: "done", summary: existing.summary };

    const job = jobs.get(draftId);
    if (!job) return { phase: "failed", message: "Publishing has not started." };

    return statusFor(draftId, job);
  },

  async checkSlug(draftId, slug): Promise<SlugCheckResult> {
    await delay(280);

    const currentSlug = published.get(draftId)?.summary.shopSlug ?? "";
    const clean = sanitiseSlug(slug);

    if (!clean || checkSlugShape(clean, currentSlug) === "too-short") {
      return { available: false, reason: "invalid", suggestions: [] };
    }

    if (isReservedSlug(clean)) {
      return {
        available: false,
        reason: "reserved",
        suggestions: deriveSlugSuggestions(clean, "kigali", [clean]),
      };
    }

    const owner = slugOwners.get(clean);
    if (owner && owner !== draftId) {
      return {
        available: false,
        reason: "taken",
        suggestions: deriveSlugSuggestions(clean, "kigali", [clean]),
      };
    }

    return { available: true };
  },

  async changeSlug(draftId, nextSlug): Promise<SlugChangeResult> {
    const record = published.get(draftId);
    if (!record) {
      return { ok: false, reason: "invalid", message: "This shop is not published yet." };
    }
    if (record.summary.slugChangesRemaining <= 0) {
      return { ok: false, reason: "no-changes-left", message: "You have already changed your link." };
    }

    const clean = sanitiseSlug(nextSlug);
    if (!clean || checkSlugShape(clean, record.summary.shopSlug) === "too-short") {
      return { ok: false, reason: "invalid", message: "That link is too short." };
    }
    if (isReservedSlug(clean)) {
      return { ok: false, reason: "reserved", message: "That link is not available." };
    }
    const owner = slugOwners.get(clean);
    if (owner && owner !== draftId) {
      return { ok: false, reason: "taken", message: "Someone already has that one." };
    }

    await delay(420);

    // The old slug stays mapped, permanently. A dead link on a printed flyer is
    // unrecoverable, so retiring one is never an option.
    record.slugHistory.push(clean);
    slugOwners.set(clean, draftId);
    record.summary = {
      ...record.summary,
      shopSlug: clean,
      shopUrl: shopUrlForSlug(clean),
      slugChangesRemaining: record.summary.slugChangesRemaining - 1,
    };

    return { ok: true, slug: clean, shopUrl: record.summary.shopUrl };
  },

  async resolveSlug(slug) {
    return slugOwners.get(sanitiseSlug(slug)) ?? null;
  },
};

/** Test helper: pre-publish a shop so the live state can be exercised directly. */
export function mockSeedPublished(draftId: string, summary: LiveSummary) {
  published.set(draftId, { summary, slugHistory: [summary.shopSlug] });
  slugOwners.set(summary.shopSlug, draftId);
}
