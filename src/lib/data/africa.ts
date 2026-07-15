import type { IconName } from "@/lib/icons";

export interface AfricaCard {
  icon: IconName;
  title: string;
  desc: string;
  rails?: string[];
  languages?: { code: string; label: string }[];
}

export const africaCards: AfricaCard[] = [
  {
    icon: "creditCard",
    title: "Payment rails that work here",
    desc: "MTN MoMo, Airtel Money, Flutterwave, Paystack — alongside Stripe for international cards. Your rural customer in Musanze pays the same way your diaspora customer in London does.",
    rails: ["MTN MoMo", "Airtel Money", "Flutterwave", "Paystack", "Stripe"],
  },
  {
    icon: "messageCircle",
    title: "WhatsApp-first commerce",
    desc: "In East and West Africa, WhatsApp is the store. SolAI's Sales Agent qualifies, negotiates, and closes in WhatsApp — generating MoMo or Airtel payment links right in the chat.",
  },
  {
    icon: "globe",
    title: "Four languages at launch",
    desc: "English, French, Kinyarwanda, and Swahili. The Sales Agent converses in the customer's language. The dashboard adapts to the seller's preference.",
    languages: [
      { code: "en", label: "English" },
      { code: "fr", label: "Français" },
      { code: "rw", label: "Ikinyarwanda" },
      { code: "sw", label: "Kiswahili" },
    ],
  },
  {
    icon: "smartphone",
    title: "Built for mid-tier Android",
    desc: "Every screen works at 375px on slow 3G. Skeleton loading, optimistic UI, minimal JS. Your seller in Nairobi gets the same experience as one in New York.",
  },
  {
    icon: "shield",
    title: "Data stays in Africa",
    desc: "AWS af-south-1 (Cape Town). Compliant with Rwanda's Data Protection Law, POPIA, and GDPR. 72-hour breach notification. NCSA registered.",
  },
  {
    icon: "users",
    title: "Sellers across the continent",
    desc: "From Kigali to Lagos, Cape Town to Dakar — SolAI supports RWF, KES, NGN, ZAR, XOF, and EUR with zero-decimal handling done right.",
  },
];
