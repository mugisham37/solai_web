import type {
  OrderStatus,
  ProductStatus,
  StatusChipTone,
} from "@/types/dashboard";

export type OrderStatusMeta = Readonly<{
  status: OrderStatus;
  labelKey: string;
  noteKey: string;
  tone: StatusChipTone;
}>;

export type ProductStatusMeta = Readonly<{
  status: ProductStatus;
  labelKey: string;
  tone: StatusChipTone;
}>;

/**
 * Single definition for the four order states. Every screen imports this —
 * two places disagreeing about what "held" looks like reads as a money bug.
 */
export const ORDER_STATUS: Readonly<Record<OrderStatus, OrderStatusMeta>> = {
  held: {
    status: "held",
    labelKey: "status.held.label",
    noteKey: "status.held.note",
    tone: "held",
  },
  transit: {
    status: "transit",
    labelKey: "status.transit.label",
    noteKey: "status.transit.note",
    tone: "line",
  },
  paid: {
    status: "paid",
    labelKey: "status.paid.label",
    noteKey: "status.paid.note",
    tone: "live",
  },
  problem: {
    status: "problem",
    labelKey: "status.problem.label",
    noteKey: "status.problem.note",
    tone: "clay",
  },
};

/** Product catalogue states — live / out of stock / draft. */
export const PRODUCT_STATUS: Readonly<Record<ProductStatus, ProductStatusMeta>> =
  {
    live: {
      status: "live",
      labelKey: "productStatus.live",
      tone: "live",
    },
    oos: {
      status: "oos",
      labelKey: "productStatus.oos",
      tone: "clay",
    },
    draft: {
      status: "draft",
      labelKey: "productStatus.draft",
      tone: "grey",
    },
  };

export function getOrderStatus(status: OrderStatus): OrderStatusMeta {
  return ORDER_STATUS[status];
}

export function getProductStatus(status: ProductStatus): ProductStatusMeta {
  return PRODUCT_STATUS[status];
}
