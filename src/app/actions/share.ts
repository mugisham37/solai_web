"use server";

import { getShareService } from "@/lib/share";
import type { ChecklistId, ChecklistState, ShareData } from "@/types/share";

/**
 * The checklist is persisted per shop rather than in the browser, so the
 * day-two prompt still knows who the seller has already told.
 */

export async function loadShareData(draftId: string): Promise<ShareData> {
  return getShareService().getShareData(draftId);
}

export async function setShareChecklistItem(
  draftId: string,
  id: ChecklistId,
  checked: boolean,
): Promise<ChecklistState> {
  return getShareService().setChecklistItem(draftId, id, checked);
}
