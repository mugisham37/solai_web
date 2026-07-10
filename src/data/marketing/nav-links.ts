import type { NavLink } from "@/types/marketing";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", isImplemented: true },
  { label: "Features", href: "/features", isImplemented: true },
  { label: "Pricing", href: "/pricing", isImplemented: true },
  { label: "For Africa", href: "/for-africa", isImplemented: true },
  { label: "Contact", href: "/contact", isImplemented: true },
];

export const LOGIN_LINK: NavLink = {
  label: "Log in",
  href: "/login",
  isImplemented: false,
};
