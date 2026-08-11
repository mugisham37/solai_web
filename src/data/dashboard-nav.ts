import type {
  DashboardNavItem,
  DashboardSection,
  DashboardView,
} from "@/types/dashboard-nav";

/**
 * One navigation model for both SidebarNav and BottomNav.
 * Labels, icons, order, section ownership and badge sources live here only.
 */
export const DASHBOARD_NAV: readonly DashboardNavItem[] = [
  {
    section: "home",
    href: "/dashboard",
    labelKey: "nav.home",
    icon: "home",
    bottom: true,
  },
  {
    section: "orders",
    href: "/dashboard/orders",
    labelKey: "nav.orders",
    icon: "tag",
    badge: "needsYou",
    bottom: true,
  },
  {
    section: "products",
    href: "/dashboard/products",
    labelKey: "nav.products",
    icon: "box",
    bottom: true,
  },
  {
    section: "money",
    href: "/dashboard/money",
    labelKey: "nav.money",
    icon: "wallet",
    bottom: true,
  },
  {
    section: "grow",
    href: "/dashboard/grow",
    labelKey: "nav.grow",
    icon: "megaphone",
    bottom: true,
  },
  {
    section: "settings",
    href: "/dashboard/settings",
    labelKey: "nav.settings",
    icon: "settings",
    bottom: false,
  },
] as const;

/** Deep views inherit the section highlight from their owner. */
export const DASHBOARD_VIEW_OWNER: Readonly<Record<DashboardView, DashboardSection>> = {
  home: "home",
  orders: "orders",
  order: "orders",
  deliver: "orders",
  paid: "orders",
  products: "products",
  product: "products",
  money: "money",
  plans: "money",
  grow: "grow",
  boost: "grow",
  settings: "settings",
};

export const DASHBOARD_SECTION_HREF: Readonly<Record<DashboardSection, string>> = {
  home: "/dashboard",
  orders: "/dashboard/orders",
  products: "/dashboard/products",
  money: "/dashboard/money",
  grow: "/dashboard/grow",
  settings: "/dashboard/settings",
};

export const DASHBOARD_VIEW_TITLE_KEY: Readonly<Record<DashboardView, string>> = {
  home: "titles.home",
  orders: "titles.orders",
  order: "titles.order",
  deliver: "titles.deliver",
  paid: "titles.paid",
  products: "titles.products",
  product: "titles.product",
  money: "titles.money",
  plans: "titles.plans",
  grow: "titles.grow",
  boost: "titles.boost",
  settings: "titles.settings",
};

export const BOTTOM_NAV_ITEMS = DASHBOARD_NAV.filter((item) => item.bottom);
