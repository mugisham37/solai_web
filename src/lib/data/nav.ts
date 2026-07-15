export interface NavLink {
  href: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href?: string;
  disabled?: boolean;
}

export interface FooterGroup {
  title: string;
  links: FooterLink[];
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/for-africa", label: "For Africa" },
  { href: "/contact", label: "Contact" },
];

export const footerGroups: FooterGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "For Africa", href: "/for-africa" },
      { label: "Changelog", disabled: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Digisi", disabled: true },
      { label: "Careers", disabled: true },
      { label: "Blog", disabled: true },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", disabled: true },
      { label: "Terms of Service", disabled: true },
      { label: "GDPR", disabled: true },
      { label: "Rwanda DPL", disabled: true },
    ],
  },
];
