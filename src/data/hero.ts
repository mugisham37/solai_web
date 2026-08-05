import type { HeroShopContent, TrustTileContent } from "@/types/landing";

export const heroTrustTiles: readonly TrustTileContent[] = [
  { id: "trust-momo", icon: "wallet", labelKey: "hero.trust.momo" },
  { id: "trust-held", icon: "shield", labelKey: "hero.trust.held" },
  { id: "trust-chat", icon: "whatsapp", labelKey: "hero.trust.chat" },
] as const;

export const heroShop: HeroShopContent = {
  statusKey: "hero.shop.status",
  shopSlug: "solai.shop/amara",
  productTitleKey: "hero.shop.productTitle",
  productMetaKey: "hero.shop.productMeta",
  price: { amountMinor: 8500, currency: "RWF" },
  stockCount: 12,
  flowCurrent: 1,
} as const;

export const heroContentKeys = {
  chipKey: "hero.chipFree",
  headlineKey: "hero.headline",
  sublineKey: "hero.subline",
  sellQuestionKey: "hero.sellQuestion",
  startButtonKey: "common.start",
  readsAsKey: "hero.readsAs",
  categoryHintKey: "hero.categoryHint",
  footnoteKey: "hero.footnote",
} as const;
