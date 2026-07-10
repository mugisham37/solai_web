import type { Faq } from "@/types/marketing";

export const FAQS: Faq[] = [
  {
    question: "Does SolAI spend money on my behalf?",
    answer:
      "Yes — on your own ad accounts. SolAI connects via OAuth and runs campaigns on accounts you own. You set daily and total spend caps that cannot be exceeded. SolAI cannot access your card; ads are billed by Meta/Google directly to your account.",
  },
  {
    question: "What happens if something goes wrong with a campaign?",
    answer:
      "SolAI monitors every campaign every 15 minutes. If CPA spikes, CTR collapses, or any anomaly is detected, the affected campaign is automatically paused. You get a dashboard alert with a full explanation. You can resume or override any time.",
  },
  {
    question: "Can I use Mobile Money to accept payments?",
    answer:
      "Absolutely. SolAI supports MTN MoMo, Airtel Money, Flutterwave, and Paystack alongside Stripe. When a buyer in Rwanda or Kenya wants to pay via MoMo, the Sales Agent generates a MoMo payment link right in the chat.",
  },
  {
    question: "How does the “Why?” button work?",
    answer:
      "Every auto-decided number on your dashboard — spend, ROAS, CPA, any agent action — has a “Why?” trigger. Click it and a popover shows the exact inputs, reasoning, and outcome of that decision. You can drill into the full audit trail from there.",
  },
  {
    question: "What languages does SolAI support?",
    answer:
      "The conversational Sales Agent handles English, French, Kinyarwanda, and Swahili at launch. The dashboard UI is available in all four. More languages are on the roadmap.",
  },
  {
    question: "Is my data safe?",
    answer:
      "SolAI runs on AWS af-south-1 (Cape Town), compliant with GDPR, POPIA, and Rwanda’s Data Protection Law. All data is encrypted at rest and in transit. Audit logs are immutable and tamper-evident. We never store raw card data — that’s Stripe’s scope.",
  },
];
