import type {
  ConnectionProvider,
  PaymentRail,
} from "@/types/onboarding";

export const CONNECTION_ITEMS: {
  key: ConnectionProvider;
  icon: string;
  label: string;
  desc: string;
  category: string;
}[] = [
  {
    key: "shopify",
    icon: "store",
    label: "Shopify",
    desc: "Import products and sync orders",
    category: "Commerce",
  },
  {
    key: "woo",
    icon: "store",
    label: "WooCommerce",
    desc: "Import products via REST API",
    category: "Commerce",
  },
  {
    key: "meta",
    icon: "users",
    label: "Meta (Facebook + Instagram)",
    desc: "Run ads, manage DMs",
    category: "Ads & Chat",
  },
  {
    key: "google",
    icon: "target",
    label: "Google Ads",
    desc: "Search and display campaigns",
    category: "Ads & Chat",
  },
  {
    key: "whatsapp",
    icon: "messageCircle",
    label: "WhatsApp Business",
    desc: "Conversational sales and support",
    category: "Ads & Chat",
  },
];

export const PAYMENT_RAILS: {
  key: PaymentRail;
  label: string;
  desc: string;
  tag: string;
  credentialEntry?: boolean;
}[] = [
  {
    key: "stripe",
    label: "Stripe",
    desc: "Cards, Apple Pay, Google Pay. International customers.",
    tag: "International",
  },
  {
    key: "momo",
    label: "MTN Mobile Money",
    desc: "MoMo payments for Rwanda, Uganda, Ghana, Cameroon.",
    tag: "East & West Africa",
    credentialEntry: true,
  },
  {
    key: "airtel",
    label: "Airtel Money",
    desc: "Airtel Money for Kenya, Uganda, Tanzania, Malawi.",
    tag: "East Africa",
    credentialEntry: true,
  },
  {
    key: "flutterwave",
    label: "Flutterwave",
    desc: "Cards + bank transfer + USSD. Nigeria, Ghana, South Africa.",
    tag: "Pan-Africa",
    credentialEntry: true,
  },
];

export const DEMO_CONNECTED_LABELS: Partial<
  Record<ConnectionProvider, string>
> = {
  shopify: "Connected as Inema Boutique",
  meta: "Connected as Inema Boutique · Ad Account #1847293",
  whatsapp: "Connected · +250 788 123 456",
  google: "Connected",
  woo: "Connected",
};

export const LAUNCH_TIMELINE = [
  {
    time: "Now",
    msg: "Campaign Planner is researching audiences and splitting budget.",
  },
  {
    time: "~5 min",
    msg: "Creative Generator produces 3 ad variants for Meta.",
  },
  {
    time: "~15 min",
    msg: "Ads submitted to Meta for review.",
  },
  {
    time: "~30 min",
    msg: "First impressions start delivering.",
  },
  {
    time: "Ongoing",
    msg: "Real-time Optimizer checks performance every 15 minutes.",
  },
] as const;
