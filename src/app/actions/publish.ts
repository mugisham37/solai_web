"use server";

import { getPublishService } from "@/lib/publish";
import type { PublishStatus, SlugChangeResult, SlugCheckResult } from "@/types/live";

/**
 * Every slug decision runs here so the reserved-word list stays on the server.
 * Publishing is polled rather than streamed, which is also what lets it keep
 * running while the seller is in another tab.
 */

export async function startPublish(draftId: string): Promise<PublishStatus> {
  return getPublishService().startPublish(draftId);
}

export async function getPublishStatus(draftId: string): Promise<PublishStatus> {
  return getPublishService().getPublishStatus(draftId);
}

export async function checkShopSlug(draftId: string, slug: string): Promise<SlugCheckResult> {
  return getPublishService().checkSlug(draftId, slug);
}

export async function changeShopSlug(draftId: string, nextSlug: string): Promise<SlugChangeResult> {
  return getPublishService().changeSlug(draftId, nextSlug);
}
