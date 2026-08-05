import type { ProtectionStageContent } from "@/types/landing";
import type { Money } from "@/types/money";

export const protectionStages: readonly ProtectionStageContent[] = [
  {
    id: "stage-paid",
    index: 0,
    titleKey: "protection.stages.paid.title",
    bodyKey: "protection.stages.paid.body",
    mockChipKey: "protection.stages.paid.chip",
    mockChipVariant: "line",
  },
  {
    id: "stage-held",
    index: 1,
    titleKey: "protection.stages.held.title",
    bodyKey: "protection.stages.held.body",
    mockChipKey: "protection.stages.held.chip",
    mockChipVariant: "held",
  },
  {
    id: "stage-code",
    index: 2,
    titleKey: "protection.stages.code.title",
    bodyKey: "protection.stages.code.body",
    mockChipKey: "protection.stages.code.chip",
    mockChipVariant: "line",
  },
  {
    id: "stage-released",
    index: 3,
    titleKey: "protection.stages.released.title",
    bodyKey: "protection.stages.released.body",
    mockChipKey: "protection.stages.released.chip",
    mockChipVariant: "live",
  },
] as const;

export const protectionMockOrder = {
  orderLabelKey: "protection.mock.order",
  hintKey: "protection.mock.hint",
  barKey: "protection.mock.bar",
} as const;

export const protectionMockAmounts = {
  buyerPay: { amountMinor: 9700, currency: "RWF" } satisfies Money,
  held: { amountMinor: 9700, currency: "RWF" } satisfies Money,
  released: { amountMinor: 8145, currency: "RWF" } satisfies Money,
  deliveryCode: "5083",
  merchantLabelKey: "protection.mock.merchant",
} as const;

export const protectionSideTiles = [
  {
    id: "tile-dispute",
    titleKey: "protection.tiles.dispute.title",
    bodyKey: "protection.tiles.dispute.body",
  },
  {
    id: "tile-cash",
    titleKey: "protection.tiles.cash.title",
    bodyKey: "protection.tiles.cash.body",
  },
] as const;

export const protectionSectionKeys = {
  eyebrowKey: "protection.eyebrow",
  titleKey: "protection.title",
  ledeKey: "protection.lede",
  tablistLabelKey: "protection.tablistLabel",
} as const;
