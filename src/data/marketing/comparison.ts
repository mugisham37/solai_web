import type { ComparisonColumn } from "@/types/marketing";

export const COMPARISON_COLUMNS: ComparisonColumn[] = [
  {
    heading: "Without SolAI",
    emphasisWord: "Without",
    tone: "negative",
    rows: [
      { text: "Ad budgets bleed with no one watching" },
      { text: "Leads go cold in unanswered DMs" },
      { text: "No idea which creative is working" },
      { text: "Agencies cost US$ 1,000–5,000/month" },
      { text: "Mobile money customers can’t check out" },
      { text: "No audit trail — “trust us” is the answer" },
      { text: "One language, one channel, one market" },
    ],
  },
  {
    heading: "With SolAI",
    emphasisWord: "With",
    tone: "positive",
    rows: [
      { text: "Every 15 min, budget flows to winners" },
      { text: "Sales Agent closes in WhatsApp, IG, Messenger" },
      { text: "A/B tests run automatically — losers paused" },
      { text: "One upload replaces the agency" },
      { text: "Stripe + MoMo + Airtel — all first-class" },
      { text: "Every decision logged with reasoning" },
      { text: "Four languages, five channels, global reach" },
    ],
  },
];
