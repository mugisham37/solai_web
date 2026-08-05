import type { PricingLineContent } from "@/types/landing";

export const pricingChips = [
  { id: "chip-no-card", labelKey: "pricing.chips.noCard" },
  { id: "chip-no-fee", labelKey: "pricing.chips.noFee" },
  { id: "chip-cancel", labelKey: "pricing.chips.cancel" },
] as const;

export const pricingLines: readonly PricingLineContent[] = [
  { id: "line-products", labelKey: "pricing.lines.products", valueKey: "pricing.values.unlimited" },
  { id: "line-wa", labelKey: "pricing.lines.whatsapp", valueKey: "pricing.values.included" },
  { id: "line-escrow", labelKey: "pricing.lines.escrow", valueKey: "pricing.values.included" },
  { id: "line-payouts", labelKey: "pricing.lines.payouts", valueKey: "pricing.values.included" },
  {
    id: "line-cut",
    labelKey: "pricing.lines.cut",
    valueKey: "pricing.values.cutPercent",
    isTotal: true,
  },
] as const;

export const pricingExample = {
  productPrice: { amountMinor: 8500, currency: "RWF" as const },
  feeMinor: 255,
} as const;

export const pricingSectionKeys = {
  eyebrowKey: "pricing.eyebrow",
  titleKey: "pricing.title",
  ledeKey: "pricing.lede",
  planNameKey: "pricing.plan.name",
  planPriceKey: "pricing.plan.price",
  planPerMonthKey: "pricing.plan.perMonth",
  planBadgeKey: "pricing.plan.badge",
  footnoteKey: "pricing.footnote",
  ctaKey: "pricing.cta",
} as const;
