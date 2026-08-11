import {
  DASHBOARD_SECTION_HREF,
  DASHBOARD_VIEW_OWNER,
  DASHBOARD_VIEW_TITLE_KEY,
} from "@/data/dashboard-nav";
import type { DashboardRouteMatch, DashboardView } from "@/types/dashboard-nav";

/**
 * Strip a trailing slash and optional locale prefix so matching is locale-agnostic.
 * next-intl's usePathname() already omits the locale; server pathnames may include it.
 */
export function normalizeDashboardPath(pathname: string): string {
  const trimmed = pathname.replace(/\/$/, "") || "/";
  const withoutLocale = trimmed.replace(/^\/(en|rw|sw|fr)(?=\/|$)/, "");
  return withoutLocale || "/";
}

function viewFromPath(path: string): DashboardView {
  if (path === "/dashboard") return "home";
  if (path === "/dashboard/orders") return "orders";
  if (path === "/dashboard/products") return "products";
  if (path === "/dashboard/money") return "money";
  if (path === "/dashboard/money/plans") return "plans";
  if (path === "/dashboard/grow") return "grow";
  if (path === "/dashboard/grow/boost") return "boost";
  if (path === "/dashboard/settings") return "settings";

  if (/^\/dashboard\/orders\/[^/]+\/deliver$/.test(path)) return "deliver";
  if (/^\/dashboard\/orders\/[^/]+\/paid$/.test(path)) return "paid";
  if (/^\/dashboard\/orders\/[^/]+$/.test(path)) return "order";
  if (/^\/dashboard\/products\/[^/]+$/.test(path)) return "product";

  return "home";
}

/** Derive the active view, section highlight, title and back target from a pathname. */
export function matchDashboardRoute(pathname: string): DashboardRouteMatch {
  const path = normalizeDashboardPath(pathname);
  const view = viewFromPath(path);
  const section = DASHBOARD_VIEW_OWNER[view];
  const sectionHref = DASHBOARD_SECTION_HREF[section];
  const isSectionRoot = path === sectionHref;

  return {
    view,
    section,
    titleKey: DASHBOARD_VIEW_TITLE_KEY[view],
    backHref: isSectionRoot ? null : sectionHref,
  };
}
