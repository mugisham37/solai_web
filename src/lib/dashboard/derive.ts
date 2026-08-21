import type {
  DashboardOrder,
  DashboardPayout,
  DashboardProduct,
  OrderFilter,
  OrderStatus,
  ProductStatus,
} from "@/types/dashboard";
import type { CurrencyCode, Money } from "@/types/money";

function money(amountMinor: number, currency: CurrencyCode): Money {
  return { amountMinor, currency };
}

/** Buyer-facing order total: item + delivery. */
export function orderTotal(order: DashboardOrder): Money {
  return money(
    order.item.amountMinor + order.delivery.amountMinor,
    order.item.currency,
  );
}

/** Seller net after platform fee and disbursement. */
export function orderNet(order: DashboardOrder): Money {
  return money(
    order.item.amountMinor - order.fee.amountMinor - order.disbursement.amountMinor,
    order.item.currency,
  );
}

/** Sum of totals for orders still in escrow (held + in transit). */
export function heldTotal(
  orders: readonly DashboardOrder[],
  currency: CurrencyCode,
): Money {
  let sum = 0;
  for (const order of orders) {
    if (order.status === "held" || order.status === "transit") {
      sum += orderTotal(order).amountMinor;
    }
  }
  return money(sum, currency);
}

export function lifetimePaid(
  payouts: readonly DashboardPayout[],
  currency: CurrencyCode,
): Money {
  let sum = 0;
  for (const payout of payouts) {
    sum += payout.amount.amountMinor;
  }
  return money(sum, currency);
}

export function countByStatus(
  orders: readonly DashboardOrder[],
  status: OrderStatus,
): number {
  let n = 0;
  for (const order of orders) {
    if (order.status === status) n += 1;
  }
  return n;
}

/** Things that will not resolve without the seller — nav badge source. */
export function needsYouCount(orders: readonly DashboardOrder[]): number {
  return countByStatus(orders, "held") + countByStatus(orders, "problem");
}

export function monthSales(
  orders: readonly DashboardOrder[],
  currency: CurrencyCode,
): Money {
  let sum = 0;
  for (const order of orders) {
    sum += order.item.amountMinor;
  }
  return money(sum, currency);
}

export function orderFilterCounts(
  orders: readonly DashboardOrder[],
): Readonly<Record<OrderFilter, number>> {
  return {
    all: orders.length,
    held: countByStatus(orders, "held"),
    transit: countByStatus(orders, "transit"),
    paid: countByStatus(orders, "paid"),
    problem: countByStatus(orders, "problem"),
  };
}

export function filterOrders(
  orders: readonly DashboardOrder[],
  products: readonly DashboardProduct[],
  opts: { filter?: OrderFilter; q?: string },
): DashboardOrder[] {
  const filter = opts.filter ?? "all";
  const q = opts.q?.trim().toLowerCase() ?? "";
  const productName = (id: string) =>
    products.find((p) => p.id === id)?.name.toLowerCase() ?? "";

  return orders.filter((order) => {
    if (filter !== "all" && order.status !== filter) return false;
    if (!q) return true;
    const hay = [
      order.id,
      order.buyerName,
      order.buyerArea,
      productName(order.productId),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

/**
 * Stock at zero → out of stock. Off sale → draft.
 * Never let a seller believe something is buyable when it is not.
 *
 * assumed default — confirm before public launch (§10: stock-at-zero
 * mid-order auto-hides to OOS; no backorder path exists).
 */
export function resolveProductStatus(stock: number, onSale: boolean): ProductStatus {
  if (!onSale) return "draft";
  if (stock <= 0) return "oos";
  return "live";
}

export function isProductOnSale(status: ProductStatus): boolean {
  return status === "live" || status === "oos";
}

export function removedProductStub(currency: CurrencyCode): DashboardProduct {
  return {
    id: "",
    name: "Removed product",
    price: money(0, currency),
    stock: 0,
    status: "draft",
    views: 0,
    sold: 0,
    palette: 0,
    description: "",
  };
}

export function findProduct(
  products: readonly DashboardProduct[],
  productId: string,
  currency: CurrencyCode,
): DashboardProduct {
  return products.find((p) => p.id === productId) ?? removedProductStub(currency);
}
