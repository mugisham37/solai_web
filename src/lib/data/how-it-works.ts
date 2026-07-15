import type { IconName } from "@/lib/icons";

export interface HowItWorksStep {
  num: string;
  icon: IconName;
  title: string;
  desc: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    num: "01",
    icon: "layers",
    title: "Upload",
    desc: "Add your product from Shopify, WooCommerce, or a URL. Describe your ideal customer. Set a daily and total spend cap.",
  },
  {
    num: "02",
    icon: "target",
    title: "Plan",
    desc: "SolAI researches which platforms to use, how to split the budget, and what audiences to target.",
  },
  {
    num: "03",
    icon: "zap",
    title: "Launch",
    desc: "Ad creatives are generated and campaigns go live on your own Meta and Google ad accounts.",
  },
  {
    num: "04",
    icon: "messageCircle",
    title: "Close",
    desc: "Leads respond on WhatsApp, Instagram, or Messenger. SolAI qualifies intent and closes the sale — Stripe or Mobile Money.",
  },
  {
    num: "05",
    icon: "barChart",
    title: "Optimise",
    desc: "Every 15 minutes, performance is checked. Budget flows to what works. Losers are paused. Every move is explained.",
  },
];
