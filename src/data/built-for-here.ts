import type { BuiltForCardContent } from "@/types/landing";

export const builtForCards: readonly BuiltForCardContent[] = [
  {
    id: "bf-momo",
    icon: "wallet",
    titleKey: "builtFor.cards.momo.title",
    bodyKey: "builtFor.cards.momo.body",
  },
  {
    id: "bf-currency",
    icon: "coins",
    titleKey: "builtFor.cards.currency.title",
    bodyKey: "builtFor.cards.currency.body",
  },
  {
    id: "bf-language",
    icon: "globe",
    titleKey: "builtFor.cards.language.title",
    bodyKey: "builtFor.cards.language.body",
  },
  {
    id: "bf-signal",
    icon: "signal",
    titleKey: "builtFor.cards.signal.title",
    bodyKey: "builtFor.cards.signal.body",
  },
] as const;

export const builtForSectionKeys = {
  eyebrowKey: "builtFor.eyebrow",
  titleKey: "builtFor.title",
} as const;
