import type { AppNavItem, WorkspaceInfo } from "@/types/app";

export const workspace: WorkspaceInfo = {
  name: "Inema Boutique",
  plan: "Growth",
  members: 5,
  region: "Africa (Kigali)",
  initials: "IB",
};

export const appNavItems: AppNavItem[] = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard", icon: "Home" },
  { id: "campaigns", href: "/campaigns", label: "Campaigns", icon: "Target" },
  {
    id: "conversations",
    href: "/conversations",
    label: "Conversations",
    icon: "MessageCircle",
  },
  { id: "orders", href: "/orders", label: "Orders", icon: "ShoppingBag" },
  { id: "audit", href: "/audit", label: "Audit Log", icon: "Clock" },
  { id: "safety", href: "/safety", label: "Safety Center", icon: "Shield" },
  { id: "reports", href: "/reports", label: "Reports", icon: "PieChart" },
  { id: "settings", href: "/settings/profile", label: "Settings", icon: "Settings" },
];

export const commandPaletteItems = [
  { label: "Dashboard", href: "/dashboard", group: "Navigate" },
  { label: "Campaigns", href: "/campaigns", group: "Navigate" },
  { label: "Conversations", href: "/conversations", group: "Navigate" },
  { label: "Compose message", href: "/conversations/compose", group: "Actions" },
  { label: "Templates", href: "/conversations/templates", group: "Actions" },
  { label: "Quarantine", href: "/conversations/quarantine", group: "Actions" },
  { label: "Settings", href: "/settings/profile", group: "Navigate" },
  { label: "Agent permissions", href: "/settings/permissions", group: "Settings" },
  { label: "Integrations", href: "/settings/integrations", group: "Settings" },
  { label: "Billing", href: "/settings/billing", group: "Settings" },
];
