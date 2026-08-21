import { createSolaiClient, unwrap } from "@/lib/api/solai-server";
import type { PublishStatus, SlugChangeResult, SlugCheckResult, PublishService } from "@/types/live";

const client = () => createSolaiClient("draft");

export const httpPublishService: PublishService = {
  async startPublish(draftId) {
    const res = await client().POST("/v1/publish/{draft_id}/start", {
      params: { path: { draft_id: draftId } },
    });
    return unwrap<PublishStatus>(res, "startPublish");
  },
  async getPublishStatus(draftId) {
    const res = await client().GET("/v1/publish/{draft_id}/status", {
      params: { path: { draft_id: draftId } },
    });
    return unwrap<PublishStatus>(res, "getPublishStatus");
  },
  async checkSlug(draftId, slug) {
    const res = await client().GET("/v1/publish/{draft_id}/slug", {
      params: { path: { draft_id: draftId }, query: { slug } },
    });
    return unwrap<SlugCheckResult>(res, "checkSlug");
  },
  async changeSlug(draftId, nextSlug) {
    const res = await client().POST("/v1/publish/{draft_id}/slug", {
      params: { path: { draft_id: draftId } },
      body: { slug: nextSlug },
    });
    return unwrap<SlugChangeResult>(res, "changeSlug");
  },
  async resolveSlug(slug) {
    const res = await client().GET("/v1/publish/resolve/{slug}", {
      params: { path: { slug } },
    });
    const data = await unwrap<{ slug: string | null }>(res, "resolveSlug");
    return data.slug;
  },
};
