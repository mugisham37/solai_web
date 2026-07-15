import type { IconName } from "@/lib/icons";

export interface ContactMethod {
  icon: IconName;
  title: string;
  value: string;
}

export const contactMethods: ContactMethod[] = [
  {
    icon: "send",
    title: "Email",
    value: "hello@solai.digisi.rw",
  },
  {
    icon: "messageCircle",
    title: "WhatsApp",
    value: "+250 788 000 000",
  },
  {
    icon: "globe",
    title: "Office",
    value: "Kigali Innovation City, KG 7 Ave, Kigali, Rwanda",
  },
];

export const legalLinks = [
  "Privacy Policy",
  "Terms of Service",
  "GDPR Notice",
  "Rwanda DPL Statement",
  "POPIA Compliance",
  "Sub-Processor Register",
] as const;

export const adSpendOptions = [
  "Under US$ 1,000",
  "US$ 1,000 – 5,000",
  "US$ 5,000 – 20,000",
  "US$ 20,000+",
] as const;

export const platformOptions = ["Shopify", "WooCommerce", "Other"] as const;
