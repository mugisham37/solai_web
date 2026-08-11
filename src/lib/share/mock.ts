import { getPublishService, SHOP_HOST } from "@/lib/publish";
import { buildCaptions } from "@/lib/share/caption-data";
import {
  EMPTY_CHECKLIST,
  type ChecklistId,
  type ChecklistState,
  type ShareData,
  type ShareService,
} from "@/types/share";

/**
 * Ticks live server-side, keyed by shop.
 *
 * The list is worth persisting for its own sake: "you told three people, who are
 * the other two?" is a genuinely useful prompt on day two, and it only works if
 * the answer survives the seller closing the tab.
 */
const checklists = new Map<string, ChecklistState>();

/** Display host, without the scheme — what goes in captions and onto images. */
const DISPLAY_HOST = `${SHOP_HOST.replace(/^https?:\/\//, "")}/`;

/** OUTSTANDING: comes from the seller's profile once that exists. */
const DEFAULT_CITY = "Kigali";

async function waitForPublished(draftId: string) {
  const publish = getPublishService();
  let status = await publish.startPublish(draftId);

  // Share is reached from live, but HMR and direct deep-links can arrive before
  // the in-memory publish job has committed. Wait rather than fail the screen.
  const deadline = Date.now() + 12_000;
  while (status.phase === "running" && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    status = await publish.getPublishStatus(draftId);
  }

  if (status.phase !== "done") {
    throw new Error("This shop is not published yet.");
  }

  return status;
}

export const mockShareService: ShareService = {
  async getShareData(draftId): Promise<ShareData> {
    const status = await waitForPublished(draftId);
    const { summary } = status;
    const shopUrl = summary.shopUrl;

    const captions = buildCaptions({
      shopName: summary.shopName,
      product: {
        title: summary.product.title,
        priceMinor: summary.product.priceMinor,
        currency: summary.product.currency,
      },
      city: DEFAULT_CITY,
      shopUrl,
      // Captions carry a local price; the seller's reading language does not
      // change what a buyer in Kigali should see.
      locale: "en",
    });

    return {
      summary: {
        shopName: summary.shopName,
        shopSlug: summary.shopSlug,
        shopUrl,
        shopHost: DISPLAY_HOST,
        city: DEFAULT_CITY,
        product: {
          title: summary.product.title,
          priceMinor: summary.product.priceMinor,
          currency: summary.product.currency,
        },
        captions,
      },
      checklist: checklists.get(draftId) ?? EMPTY_CHECKLIST,
    };
  },

  async setChecklistItem(draftId, id: ChecklistId, checked): Promise<ChecklistState> {
    const current = checklists.get(draftId) ?? EMPTY_CHECKLIST;
    const next: ChecklistState = { ...current, [id]: checked };
    checklists.set(draftId, next);
    return next;
  },
};

/** Test helper: drop stored ticks so a run starts from an empty list. */
export function mockResetChecklist(draftId: string) {
  checklists.delete(draftId);
}
