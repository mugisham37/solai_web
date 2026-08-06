import type { IconName } from "@/types/icon";

/** Top-level dashboard sections (sidebar shows all six). */
export type DashboardSection =
  | "home"
  | "orders"
  | "products"
  | "money"
  | "grow"
  | "settings";

/** Every routable view, including deep routes owned by a section. */
export type DashboardView =
  | DashboardSection
  | "order"
  | "deliver"
  | "paid"
  | "product"
  | "plans"
  | "boost";

export type DashboardNavItem = Readonly<{
  section: DashboardSection;
  href: string;
  labelKey: string;
  icon: IconName;
  /** Orders badge counts held + problem — only this item uses it. */
  badge?: "needsYou";
  /** Included in the phone/tablet bottom bar (max five). */
  bottom: boolean;
}>;

export type DashboardRouteMatch = Readonly<{
  view: DashboardView;
  section: DashboardSection;
  titleKey: string;
  /** Section root for the back affordance (null on section roots). */
  backHref: string | null;
}>;
