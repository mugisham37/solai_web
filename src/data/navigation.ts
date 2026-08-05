import type { NavItem } from "@/types/landing";

export const mainNav: readonly NavItem[] = [
  { id: "nav-how", href: "#how", labelKey: "nav.howItWorks" },
  { id: "nav-protection", href: "#protection", labelKey: "nav.protection" },
  { id: "nav-whatsapp", href: "#whatsapp", labelKey: "nav.whatsapp" },
  { id: "nav-pricing", href: "#pricing", labelKey: "nav.pricing" },
  { id: "nav-buyers", href: "#buyers", labelKey: "nav.buyers" },
] as const;

export const announcement = {
  id: "announce-payouts",
  messageKey: "announcement.message",
  highlightKey: "announcement.highlight",
} as const;
