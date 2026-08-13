import { mockDashboardService } from "@/lib/dashboard/store";
import { httpDashboardService } from "@/lib/dashboard/http";
import type { DashboardService } from "@/types/dashboard";

export type { DashboardService } from "@/types/dashboard";
export { matchDashboardRoute, normalizeDashboardPath } from "./section";
export {
  ORDER_STATUS,
  PRODUCT_STATUS,
  getOrderStatus,
  getProductStatus,
} from "./status";
export type { OrderStatusMeta, ProductStatusMeta } from "./status";
export {
  countByStatus,
  filterOrders,
  findProduct,
  heldTotal,
  isProductOnSale,
  lifetimePaid,
  monthSales,
  needsYouCount,
  orderFilterCounts,
  orderNet,
  orderTotal,
  removedProductStub,
  resolveProductStatus,
} from "./derive";
export { escrowStageForOrder } from "./escrow";
export { notificationHref } from "./notification-href";
export {
  isOrderFilter,
  ORDER_FILTER_KEYS,
  parseOrdersSearchParams,
} from "./orders-query";
export {
  createDashboardSeed,
  DEFAULT_ORDER_PAGE_SIZE,
  HOME_SPARKLINE,
  HOME_SPARKLINE_HIGHLIGHT,
} from "./mock";
export { resetDashboardStore } from "./store";

const useHttp = process.env.SOLAI_USE_HTTP_DASHBOARD !== "0";

let service: DashboardService = useHttp ? httpDashboardService : mockDashboardService;

export function getDashboardService(): DashboardService {
  return service;
}

export function setDashboardService(next: DashboardService) {
  service = next;
}
