import type { FooterLinkColumn } from "@/types/marketing";

export const FOOTER_COLUMNS: FooterLinkColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features", isImplemented: true },
      { label: "Pricing", href: "/pricing", isImplemented: true },
      { label: "For Africa", href: "/for-africa", isImplemented: true },
      { label: "Changelog", href: "/changelog", isImplemented: false },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Digisi", href: "/about", isImplemented: false },
      { label: "Careers", href: "/careers", isImplemented: false },
      { label: "Blog", href: "/blog", isImplemented: false },
      { label: "Contact", href: "/contact", isImplemented: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy", isImplemented: false },
      { label: "Terms of Service", href: "/legal/terms", isImplemented: false },
      { label: "GDPR", href: "/legal/gdpr", isImplemented: false },
      { label: "Rwanda DPL", href: "/legal/rwanda-dpl", isImplemented: false },
    ],
  },
];

export const COMPLIANCE_BADGES = [
  "Hard caps",
  "Audit-grade",
  "GDPR",
  "POPIA",
  "Rwanda DPL",
] as const;
