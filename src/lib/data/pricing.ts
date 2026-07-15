export const currencyRates = {
  "US$": 1,
  EUR: 0.92,
  RWF: 1350,
  KES: 153,
  NGN: 1550,
  ZAR: 18.5,
} as const;

export const zeroDecimalCurrencies = ["RWF", "KES", "NGN"] as const;

export const currencies = Object.keys(currencyRates) as (keyof typeof currencyRates)[];

export interface PricingTier {
  tier: string;
  priceUsd: number;
  period?: string;
  annualUsd?: number;
  desc: string;
  features: string[];
  cta: string;
  ctaVariant: "primary" | "secondary";
  featured?: boolean;
}

export const subscriptionTiers: PricingTier[] = [
  {
    tier: "01 · Starter",
    priceUsd: 0,
    period: "Free forever",
    desc: "Try SolAI with one product, one channel, and US$ 500/month ad-spend headroom.",
    features: [
      "1 product",
      "Meta Ads only",
      "WhatsApp + web widget",
      "Stripe payments",
      "Full audit trail",
    ],
    cta: "Start free",
    ctaVariant: "secondary",
  },
  {
    tier: "02 · Growth",
    priceUsd: 99,
    annualUsd: 948,
    desc: "Full platform. All channels. All payment rails. Unlimited products.",
    features: [
      "Unlimited products",
      "Meta + Google Ads",
      "All 5 chat channels",
      "Stripe + MoMo + Airtel",
      "Up to US$ 10,000/mo ad spend",
      "CRM integrations",
      "Priority support",
    ],
    cta: "Start free trial",
    ctaVariant: "primary",
    featured: true,
  },
  {
    tier: "03 · Scale",
    priceUsd: 349,
    annualUsd: 3348,
    desc: "High-volume sellers. Custom caps. Dedicated support. SLA.",
    features: [
      "Everything in Growth",
      "Unlimited ad spend",
      "TikTok Ads (beta)",
      "Custom CRM webhooks",
      "Compliance exports",
      "99.9% SLA",
    ],
    cta: "Talk to sales",
    ctaVariant: "secondary",
  },
];

export const performancePricing = {
  tier: 'Performance · "We only win when you win"',
  rate: "8%",
  rateSuffix: " of attributed revenue",
  desc: "SolAI takes a percentage of incremental, attributable revenue — revenue that the audit log can prove was driven by SolAI-managed campaigns or conversations.",
  exampleRevenueUsd: 10000,
  feePercent: 0.08,
  features: [
    "No monthly fee — only pay on results",
    "Audit-grade attribution chain",
    "Monthly signed settlement statements",
    "Dispute any attributed conversion",
    "Full platform access",
  ],
  cta: "Apply for performance pricing",
};
