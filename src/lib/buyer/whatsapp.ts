import { formatMoney } from "@/lib/money";
import { shopPublicUrl } from "@/lib/buyer/store";
import type { Money } from "@/types/money";

/** Prefill for “Ask” CTAs — opens WhatsApp with shop + product context. */
export function buyerAskWhatsAppUrl(input: {
  shopName: string;
  slug: string;
  productTitle: string;
  price: Money;
  locale: string;
}): string {
  const msg = `Hello ${input.shopName}! I saw ${input.productTitle} (${formatMoney(input.price, input.locale)}) on ${shopPublicUrl(input.slug).replace(/^https?:\/\//, "")}. `;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}
