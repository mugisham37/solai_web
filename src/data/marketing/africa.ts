import type { AfricaCardContent, Stat } from "@/types/marketing";

export const AFRICA_CARDS: AfricaCardContent[] = [
  {
    icon: "creditCard",
    title: "Payment rails that work here",
    description:
      "MTN MoMo, Airtel Money, Flutterwave, Paystack — alongside Stripe for international cards. Your rural customer in Musanze pays the same way your diaspora customer in London does.",
    badges: [
      { label: "MTN MoMo", tone: "neutral" },
      { label: "Airtel Money", tone: "neutral" },
      { label: "Flutterwave", tone: "neutral" },
      { label: "Paystack", tone: "neutral" },
      { label: "Stripe", tone: "neutral" },
    ],
  },
  {
    icon: "messageCircle",
    title: "WhatsApp-first commerce",
    description:
      "In East and West Africa, WhatsApp is the store. SolAI's Sales Agent qualifies, negotiates, and closes in WhatsApp — generating MoMo or Airtel payment links right in the chat.",
  },
  {
    icon: "globe",
    title: "Four languages at launch",
    description:
      "English, French, Kinyarwanda, and Swahili. The Sales Agent converses in the customer's language. The dashboard adapts to the seller's preference.",
    badges: [
      { label: "English", tone: "brand" },
      { label: "Français", tone: "brand" },
      { label: "Ikinyarwanda", tone: "brand" },
      { label: "Kiswahili", tone: "brand" },
    ],
  },
  {
    icon: "smartphone",
    title: "Built for mid-tier Android",
    description:
      "Every screen works at 375px on slow 3G. Skeleton loading, optimistic UI, minimal JS. Your seller in Nairobi gets the same experience as one in New York.",
  },
  {
    icon: "shield",
    title: "Data stays in Africa",
    description:
      "AWS af-south-1 (Cape Town). Compliant with Rwanda's Data Protection Law, POPIA, and GDPR. 72-hour breach notification. NCSA registered.",
  },
  {
    icon: "users",
    title: "Sellers across the continent",
    description:
      "From Kigali to Lagos, Cape Town to Dakar — SolAI supports RWF, KES, NGN, ZAR, XOF, and EUR with zero-decimal handling done right.",
  },
];

export const AFRICA_STATS: Stat[] = [
  { value: "🇷🇼", label: "Headquartered in Kigali" },
  { value: "4", label: "Languages at launch" },
  { value: "5+", label: "Payment rails" },
  { value: "af-south-1", label: "Data residency" },
];
