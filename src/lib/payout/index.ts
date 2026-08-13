import { mockPayoutService } from "@/lib/payout/mock";
import { httpPayoutService } from "@/lib/payout/http";
import type { PayoutService } from "@/types/payout";

export type { PayoutService } from "@/types/payout";

const useHttp = process.env.SOLAI_USE_HTTP_PAYOUT !== "0";

let service: PayoutService = useHttp ? httpPayoutService : mockPayoutService;

export function getPayoutService(): PayoutService {
  return service;
}

export function setPayoutService(next: PayoutService) {
  service = next;
}
