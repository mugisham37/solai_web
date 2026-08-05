import type { DashboardNotification } from "@/types/dashboard";

/** Resolve a notification subject to a dashboard path. */
export function notificationHref(
  subject: DashboardNotification["subject"],
): string {
  switch (subject.type) {
    case "order":
      return `/dashboard/orders/${subject.orderId}`;
    case "product":
      return `/dashboard/products/${subject.productId}`;
    case "money":
      return "/dashboard/money";
    case "grow":
      return "/dashboard/grow";
    case "settings":
      return "/dashboard/settings";
  }
}
