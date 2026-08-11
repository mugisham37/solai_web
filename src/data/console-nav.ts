import type { ConsoleNavItem, ConsoleSection, ConsoleView } from "@/types/console-nav";

/**
 * One navigation model for both ConsoleSidebar and ConsoleBottomNav.
 * Rules is desktop-only (bottom: false) — five items on the phone bar.
 */
export const CONSOLE_NAV: readonly ConsoleNavItem[] = [
  {
    section: "overview",
    href: "/console",
    labelKey: "nav.overview",
    icon: "layoutGrid",
    bottom: true,
  },
  {
    section: "disputes",
    href: "/console/disputes",
    labelKey: "nav.disputes",
    icon: "scale",
    badge: "breach",
    bottom: true,
  },
  {
    section: "people",
    href: "/console/people",
    labelKey: "nav.people",
    icon: "users",
    bottom: true,
  },
  {
    section: "listings",
    href: "/console/listings",
    labelKey: "nav.listings",
    icon: "image",
    bottom: true,
  },
  {
    section: "ledger",
    href: "/console/ledger",
    labelKey: "nav.ledger",
    icon: "chart",
    bottom: true,
  },
  {
    section: "rules",
    href: "/console/rules",
    labelKey: "nav.rules",
    icon: "settings",
    bottom: false,
  },
] as const;

export const CONSOLE_VIEW_OWNER: Readonly<Record<ConsoleView, ConsoleSection | "login">> = {
  overview: "overview",
  disputes: "disputes",
  case: "disputes",
  people: "people",
  person: "people",
  listings: "listings",
  ledger: "ledger",
  rules: "rules",
  login: "login",
};

export const CONSOLE_SECTION_HREF: Readonly<Record<ConsoleSection, string>> = {
  overview: "/console",
  disputes: "/console/disputes",
  people: "/console/people",
  listings: "/console/listings",
  ledger: "/console/ledger",
  rules: "/console/rules",
};

export const CONSOLE_VIEW_TITLE_KEY: Readonly<Record<ConsoleView, string>> = {
  overview: "titles.overview",
  disputes: "titles.disputes",
  case: "titles.case",
  people: "titles.people",
  person: "titles.person",
  listings: "titles.listings",
  ledger: "titles.ledger",
  rules: "titles.rules",
  login: "titles.login",
};

export const CONSOLE_BOTTOM_NAV = CONSOLE_NAV.filter((item) => item.bottom);

export const DEMO_AGENTS = [
  {
    id: "agent-support",
    name: "N. Habimana",
    initials: "NH",
    role: "support" as const,
  },
  {
    id: "agent-finance",
    name: "T. Kayitesi",
    initials: "TK",
    role: "finance" as const,
  },
  {
    id: "agent-admin",
    name: "P. Mugenzi",
    initials: "PM",
    role: "admin" as const,
  },
] as const;
