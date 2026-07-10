import type { CtaLink } from "@/types/marketing";

export const FINAL_CTA: {
  heading: string;
  subCopy: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
} = {
  heading: "Ready to let SolAI run your growth?",
  subCopy:
    "Upload your first product. Set a cap. Walk away. Revenue starts flowing.",
  primaryCta: { label: "Start free", href: "/signup", isImplemented: false },
  secondaryCta: { label: "Talk to us", href: "/contact", isImplemented: true },
};
