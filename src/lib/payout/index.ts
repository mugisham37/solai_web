import { mockPayoutService } from "@/lib/payout/mock";
import type { PayoutService } from "@/types/payout";

export type { PayoutService } from "@/types/payout";

let service: PayoutService = mockPayoutService;

export function getPayoutService(): PayoutService {
  return service;
}

export function setPayoutService(next: PayoutService) {
  service = next;
}
