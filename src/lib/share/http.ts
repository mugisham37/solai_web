import { createSolaiClient, unwrap } from "@/lib/api/solai-server";
import type { ChecklistId, ChecklistState, ShareData, ShareService } from "@/types/share";

const client = () => createSolaiClient("draft");

export const httpShareService: ShareService = {
  async getShareData(draftId) {
    const res = await client().GET("/v1/share/{draft_id}", {
      params: { path: { draft_id: draftId } },
    });
    return unwrap<ShareData>(res, "getShareData");
  },
  async setChecklistItem(draftId, id: ChecklistId, checked: boolean) {
    const res = await client().POST("/v1/share/{draft_id}/checklist", {
      params: { path: { draft_id: draftId } },
      body: { id, checked },
    });
    return unwrap<ChecklistState>(res, "setChecklistItem");
  },
};
