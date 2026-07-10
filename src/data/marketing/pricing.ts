import type { CurrencyCode, PerformancePricing, PriceTier } from "@/types/marketing";

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  "US$": 1,
  EUR: 0.92,
  RWF: 1350,
  KES: 153,
  NGN: 1550,
  ZAR: 18.5,
};

export const ZERO_DECIMAL_CURRENCIES: readonly CurrencyCode[] = ["RWF", "KES", "NGN"];

/** Sentinel swapped for a live-formatted "Up to {cap}/mo ad spend" bullet by PriceCard. */
export const AD_SPEND_CAP_TOKEN = "__AD_SPEND_CAP__";

export const AD_SPEND_CAP_USD = 10000;

export const PRICE_TIERS: PriceTier[] = [
  {
    tierLabel: "01 · Starter",
    amountUsd: 0,
    period: "free",
    description:
      "Try SolAI with one product, one channel, and US$ 500/month ad-spend headroom.",
    features: [
      "1 product",
      "Meta Ads only",
      "WhatsApp + web widget",
      "Stripe payments",
      "Full audit trail",
    ],
    cta: { label: "Start free", href: "/signup", isImplemented: false },
  },
  {
    tierLabel: "02 · Growth",
    amountUsd: 99,
    period: "monthly",
    annualNoteUsd: 948,
    description: "Full platform. All channels. All payment rails. Unlimited products.",
    features: [
      "Unlimited products",
      "Meta + Google Ads",
      "All 5 chat channels",
      "Stripe + MoMo + Airtel",
      AD_SPEND_CAP_TOKEN,
      "CRM integrations",
      "Priority support",
    ],
    cta: { label: "Start free trial", href: "/signup", isImplemented: false },
    featured: true,
  },
  {
    tierLabel: "03 · Scale",
    amountUsd: 349,
    period: "monthly",
    annualNoteUsd: 3348,
    description: "High-volume sellers. Custom caps. Dedicated support. SLA.",
    features: [
      "Everything in Growth",
      "Unlimited ad spend",
      "TikTok Ads (beta)",
      "Custom CRM webhooks",
      "Compliance exports",
      "99.9% SLA",
    ],
    cta: { label: "Talk to sales", href: "/contact", isImplemented: true },
  },
];

export const PERFORMANCE_PRICING: PerformancePricing = {
  label: 'Performance · "We only win when you win"',
  feePercent: 8,
  description:
    "SolAI takes a percentage of incremental, attributable revenue — revenue that the audit log can prove was driven by SolAI-managed campaigns or conversations.",
  exampleRevenueUsd: 10000,
  features: [
    "No monthly fee — only pay on results",
    "Audit-grade attribution chain",
    "Monthly signed settlement statements",
    "Dispute any attributed conversion",
    "Full platform access",
  ],
  cta: {
    label: "Apply for performance pricing",
    href: "/contact",
    isImplemented: true,
  },
};
