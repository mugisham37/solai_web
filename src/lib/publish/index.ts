import { mockPublishService } from "@/lib/publish/mock";
import { httpPublishService } from "@/lib/publish/http";
import type { PublishService } from "@/types/live";

export type { PublishService } from "@/types/live";
export { SHOP_HOST, shopUrlForSlug } from "@/lib/publish/mock";

const useHttp = process.env.SOLAI_USE_HTTP_PUBLISH !== "0";

let service: PublishService = useHttp ? httpPublishService : mockPublishService;

export function getPublishService(): PublishService {
  return service;
}

export function setPublishService(next: PublishService) {
  service = next;
}
