import type { WhatsAppBulletContent } from "@/types/landing";
import type { Money } from "@/types/money";

export const whatsAppBullets: readonly WhatsAppBulletContent[] = [
  {
    id: "wa-no-page",
    titleKey: "whatsapp.bullets.noPage.title",
    bodyKey: "whatsapp.bullets.noPage.body",
  },
  {
    id: "wa-checkout",
    titleKey: "whatsapp.bullets.checkout.title",
    bodyKey: "whatsapp.bullets.checkout.body",
  },
  {
    id: "wa-protection",
    titleKey: "whatsapp.bullets.protection.title",
    bodyKey: "whatsapp.bullets.protection.body",
  },
] as const;

export const whatsAppChat = {
  buyerMessageKey: "whatsapp.chat.buyerAsk",
  sellerBodyKey: "whatsapp.chat.sellerBody",
  sellerStrongKey: "whatsapp.chat.sellerStrong",
  sellerDetailKey: "whatsapp.chat.sellerDetail",
  viewCatalogueKey: "whatsapp.chat.viewCatalogue",
  buyNowKey: "whatsapp.chat.buyNow",
  buyerReplyKey: "whatsapp.chat.buyerReply",
  aiNoteKey: "whatsapp.chat.aiNote",
  productPrice: { amountMinor: 8500, currency: "RWF" } satisfies Money,
} as const;

export const whatsAppSectionKeys = {
  eyebrowKey: "whatsapp.eyebrow",
  titleKey: "whatsapp.title",
  titleMarkKey: "whatsapp.titleMark",
  ledeKey: "whatsapp.lede",
  ctaKey: "whatsapp.cta",
} as const;
