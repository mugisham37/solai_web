import { mockPublishService } from "@/lib/publish/mock";
import type { PublishService } from "@/types/live";

export type { PublishService } from "@/types/live";
export { SHOP_HOST, shopUrlForSlug } from "@/lib/publish/mock";

let service: PublishService = mockPublishService;

export function getPublishService(): PublishService {
  return service;
}

export function setPublishService(next: PublishService) {
  service = next;
}
