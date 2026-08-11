import { mockShareService } from "@/lib/share/mock";
import type { ShareService } from "@/types/share";

export type { ShareService } from "@/types/share";

let service: ShareService = mockShareService;

export function getShareService(): ShareService {
  return service;
}

export function setShareService(next: ShareService) {
  service = next;
}
