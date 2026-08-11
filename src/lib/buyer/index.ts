import { mockBuyerService } from "@/lib/buyer/store";
import type { BuyerService } from "@/types/buyer";

export type { BuyerService } from "@/types/buyer";
export {
  calcLineTotal,
  clampQty,
  defaultAreaId,
  findArea,
  isPurchasable,
} from "./pricing";
export type { PriceBreakdown } from "./pricing";
export { createBuyerSeed, CHECKOUT_SESSION_TTL_MS } from "./mock";
export {
  productPublicPath,
  resetBuyerStore,
  shopPublicUrl,
  orderPublicPath,
} from "./store";
export {
  inAppOrderPath,
  inAppProductPath,
  inAppShopPath,
  isExternalHref,
} from "./paths";
export { buyerAskWhatsAppUrl } from "./whatsapp";

export const MOMO_TIMEOUT_SECONDS = 119;

let service: BuyerService = mockBuyerService;

export function getBuyerService(): BuyerService {
  return service;
}

export function setBuyerService(next: BuyerService) {
  service = next;
}
