import type { CtaLink, ContactMethod, SelectOption } from "@/types/marketing";

export const CONTACT_METHODS: ContactMethod[] = [
  { icon: "send", label: "Email", value: "hello@solai.digisi.rw" },
  { icon: "messageCircle", label: "WhatsApp", value: "+250 788 000 000" },
  {
    icon: "globe",
    label: "Office",
    value: "Kigali Innovation City, KG 7 Ave, Kigali, Rwanda",
  },
];

export const CONTACT_LEGAL_LINKS: CtaLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy", isImplemented: false },
  { label: "Terms of Service", href: "/legal/terms", isImplemented: false },
  { label: "GDPR Notice", href: "/legal/gdpr", isImplemented: false },
  { label: "Rwanda DPL Statement", href: "/legal/rwanda-dpl", isImplemented: false },
  { label: "POPIA Compliance", href: "/legal/popia", isImplemented: false },
  {
    label: "Sub-Processor Register",
    href: "/legal/sub-processors",
    isImplemented: false,
  },
];

export const AD_SPEND_OPTIONS: SelectOption[] = [
  { label: "Under US$ 1,000" },
  { label: "US$ 1,000 – 5,000" },
  { label: "US$ 5,000 – 20,000" },
  { label: "US$ 20,000+" },
];

export const PLATFORM_OPTIONS: SelectOption[] = [
  { label: "Shopify" },
  { label: "WooCommerce" },
  { label: "Other" },
];

export const CONTACT_FORM_COPY = {
  formHeading: "Request a demo",
  namePlaceholder: "Kalisa Mugisha",
  emailPlaceholder: "kalisa@inema.rw",
  companyPlaceholder: "Inema Boutique",
  messagePlaceholder: "Tell us about your products, target market, or questions...",
  submitLabel: "Send request",
};

export const CONTACT_SUCCESS_COPY = {
  heading: "We'll be in touch within 24 hours.",
  body: "Check your inbox for a confirmation. In the meantime, you can start a free account immediately.",
  cta: { label: "Start free now", href: "/signup", isImplemented: false } satisfies CtaLink,
};
