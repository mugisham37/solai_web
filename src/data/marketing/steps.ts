import type { Step } from "@/types/marketing";

export const STEPS: Step[] = [
  {
    number: "01",
    icon: "layers",
    title: "Upload",
    description:
      "Add your product from Shopify, WooCommerce, or a URL. Describe your ideal customer. Set a daily and total spend cap.",
  },
  {
    number: "02",
    icon: "target",
    title: "Plan",
    description:
      "SolAI researches which platforms to use, how to split the budget, and what audiences to target.",
  },
  {
    number: "03",
    icon: "zap",
    title: "Launch",
    description:
      "Ad creatives are generated and campaigns go live on your own Meta and Google ad accounts.",
  },
  {
    number: "04",
    icon: "messageCircle",
    title: "Close",
    description:
      "Leads respond on WhatsApp, Instagram, or Messenger. SolAI qualifies intent and closes the sale — Stripe or Mobile Money.",
  },
  {
    number: "05",
    icon: "barChart",
    title: "Optimise",
    description:
      "Every 15 minutes, performance is checked. Budget flows to what works. Losers are paused. Every move is explained.",
  },
];
