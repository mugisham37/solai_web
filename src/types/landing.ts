import type { IconName } from "@/types/icon";
import type { Money } from "@/types/money";
import type { EscrowStageIndex } from "@/types/escrow";

export type NavItem = Readonly<{
  id: string;
  href: string;
  labelKey: string;
}>;

export type TrustTileContent = Readonly<{
  id: string;
  icon: IconName;
  labelKey: string;
}>;

export type ProofStatContent = Readonly<{
  id: string;
  type: "money" | "number" | "time" | "percent";
  count?: number;
  suffix?: string;
  money?: Money;
  labelKey: string;
  secondCount?: number;
}>;

export type StepContent = Readonly<{
  id: string;
  number: number;
  titleKey: string;
  bodyKey: string;
  timeKey: string;
}>;

export type ProtectionStageContent = Readonly<{
  id: string;
  index: EscrowStageIndex;
  titleKey: string;
  bodyKey: string;
  mockChipKey: string;
  mockChipVariant: "line" | "held" | "live";
}>;

export type WhatsAppBulletContent = Readonly<{
  id: string;
  titleKey: string;
  bodyKey: string;
}>;

export type BuiltForCardContent = Readonly<{
  id: string;
  icon: IconName;
  titleKey: string;
  bodyKey: string;
}>;

export type PricingLineContent = Readonly<{
  id: string;
  labelKey: string;
  valueKey: string;
  isTotal?: boolean;
}>;

export type BuyerBulletContent = Readonly<{
  id: string;
  icon: IconName;
  bodyKey: string;
}>;

export type SellerQuoteContent = Readonly<{
  id: string;
  quoteKey: string;
  initials: string;
  nameKey: string;
  tradeKey: string;
}>;

export type FaqItemContent = Readonly<{
  id: string;
  questionKey: string;
  answerKey: string;
}>;

export type FooterLinkContent = Readonly<{
  id: string;
  href: string;
  labelKey: string;
}>;

export type FooterGroupContent = Readonly<{
  id: string;
  titleKey: string;
  links: readonly FooterLinkContent[];
}>;

export type SiteMetaContent = Readonly<{
  titleKey: string;
  descriptionKey: string;
  canonicalBase: string;
  organizationName: string;
}>;

export type HeroShopContent = Readonly<{
  statusKey: string;
  shopSlug: string;
  productTitleKey: string;
  productMetaKey: string;
  price: Money;
  stockCount: number;
  flowCurrent: EscrowStageIndex;
}>;
