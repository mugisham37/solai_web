/**
 * DESIGN-COMP QUOTES — not real seller testimonials.
 * Replace with consented, attributable quotes before production launch.
 */
import type { SellerQuoteContent } from "@/types/landing";

export const sellerQuotes: readonly SellerQuoteContent[] = [
  {
    id: "quote-amara",
    quoteKey: "sellers.quotes.amara.text",
    initials: "AU",
    nameKey: "sellers.quotes.amara.name",
    tradeKey: "sellers.quotes.amara.trade",
  },
  {
    id: "quote-grace",
    quoteKey: "sellers.quotes.grace.text",
    initials: "GN",
    nameKey: "sellers.quotes.grace.name",
    tradeKey: "sellers.quotes.grace.trade",
  },
  {
    id: "quote-samuel",
    quoteKey: "sellers.quotes.samuel.text",
    initials: "SK",
    nameKey: "sellers.quotes.samuel.name",
    tradeKey: "sellers.quotes.samuel.trade",
  },
] as const;

export const sellerStoriesKeys = {
  eyebrowKey: "sellers.eyebrow",
  titleKey: "sellers.title",
} as const;
