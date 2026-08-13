import { mockShareService } from "@/lib/share/mock";
import { httpShareService } from "@/lib/share/http";
import type { ShareService } from "@/types/share";

export type { ShareService } from "@/types/share";

const useHttp = process.env.SOLAI_USE_HTTP_SHARE !== "0";

let service: ShareService = useHttp ? httpShareService : mockShareService;

export function getShareService(): ShareService {
  return service;
}

export function setShareService(next: ShareService) {
  service = next;
}
