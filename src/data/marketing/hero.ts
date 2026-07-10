import type { HeroContent, HeroLayer } from "@/types/marketing";

export const HERO_CONTENT: HeroContent = {
  eyebrow: "Autonomous E-Commerce Revenue Engine",
  titleLine1: "Upload a product.",
  titleLine2Before: "SolAI runs ",
  titleEmphasis: "everything",
  titleLine2After: " else.",
  subCopy:
    "One upload. Ads launch on Meta and Google. Leads convert on WhatsApp. Orders close via Stripe or Mobile Money. Every decision explained. Every cent tracked.",
  primaryCta: { label: "Start free", href: "/signup", isImplemented: false },
  secondaryCta: { label: "Watch demo", href: "/contact", isImplemented: true },
  trustLine: "Trusted by sellers in",
  trustCountries: [
    { code: "rw", name: "Rwanda" },
    { code: "ke", name: "Kenya" },
    { code: "ng", name: "Nigeria" },
    { code: "za", name: "South Africa" },
    { code: "sn", name: "Senegal" },
  ],
};

export const HERO_LAYERS: HeroLayer[] = [
  { id: "discovery", label: "Discovery + Reach" },
  { id: "qualify", label: "Qualify + Close" },
  { id: "revenue", label: "Revenue + Audit" },
];
