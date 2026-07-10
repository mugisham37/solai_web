export interface CtaLink {
  label: string;
  href: string;
  /** Once the destination route actually exists, flip to true to render a real next/link. */
  isImplemented: boolean;
}

export type NavLink = CtaLink;

export interface FooterLinkColumn {
  title: string;
  links: CtaLink[];
}

export interface TrustCountry {
  code: "rw" | "ke" | "ng" | "za" | "sn";
  name: string;
}

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2Before: string;
  titleEmphasis: string;
  titleLine2After: string;
  subCopy: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  trustLine: string;
  trustCountries: TrustCountry[];
}

export interface HeroLayer {
  id: string;
  label: string;
}

export type MarketingIconKey =
  | "layers"
  | "target"
  | "zap"
  | "messageCircle"
  | "barChart"
  | "eye"
  | "shield"
  | "creditCard"
  | "refreshCw"
  | "globe"
  | "lock"
  | "smartphone"
  | "users"
  | "send";

export interface Step {
  number: string;
  icon: MarketingIconKey;
  title: string;
  description: string;
}

export interface WhyDemoContent {
  label: string;
  value: string;
  decimalSuffix: string;
  capNote: string;
  statusLabel: string;
  reasonHeading: string;
  reasons: string[];
  agentName: string;
  runId: string;
}

export interface ComparisonRow {
  text: string;
}

export interface ComparisonColumn {
  heading: string;
  emphasisWord: string;
  tone: "negative" | "positive";
  rows: ComparisonRow[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  company: string;
  location: string;
  quote: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface LogoItem {
  name: string;
}

export interface Feature {
  icon: MarketingIconKey;
  title: string;
  description: string;
  detail: string;
}

export interface PriceTier {
  tierLabel: string;
  amountUsd: number;
  period: "free" | "monthly";
  annualNoteUsd?: number;
  description: string;
  features: string[];
  cta: CtaLink;
  featured?: boolean;
}

export interface PerformancePricing {
  label: string;
  feePercent: number;
  description: string;
  exampleRevenueUsd: number;
  features: string[];
  cta: CtaLink;
}

export type CurrencyCode = "US$" | "EUR" | "RWF" | "KES" | "NGN" | "ZAR";

export interface AfricaBadge {
  label: string;
  tone: "neutral" | "brand";
}

export interface AfricaCardContent {
  icon: MarketingIconKey;
  title: string;
  description: string;
  badges?: AfricaBadge[];
}

export interface ContactMethod {
  icon: MarketingIconKey;
  label: string;
  value: string;
}

export interface SelectOption {
  label: string;
}
