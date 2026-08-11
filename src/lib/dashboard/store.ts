import {
  createDashboardSeed,
  DEFAULT_ORDER_PAGE_SIZE,
  HOME_SPARKLINE,
  HOME_SPARKLINE_HIGHLIGHT,
} from "@/lib/dashboard/mock";
import {
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
  resolveProductStatus,
} from "@/lib/dashboard/derive";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitiseSlug } from "@/lib/slug";
import type {
  DashboardNotification,
  DashboardOrder,
  DashboardPayout,
  DashboardProduct,
  DashboardService,
  DashboardShop,
  HomeSnapshot,
  MoneySnapshot,
  OrderListQuery,
  OrderListResult,
  ReleaseOrderResult,
  SaveProductInput,
  SaveShopSettingsInput,
  ShopPlan,
} from "@/types/dashboard";

type MutableState = {
  shop: DashboardShop;
  products: DashboardProduct[];
  orders: DashboardOrder[];
  payouts: DashboardPayout[];
  notifications: DashboardNotification[];
  payoutSeq: number;
};

function cloneSeed(): MutableState {
  const seed = createDashboardSeed();
  return {
    shop: { ...seed.shop, availableBalance: { ...seed.shop.availableBalance } },
    products: seed.products.map((p) => ({ ...p, price: { ...p.price } })),
    orders: seed.orders.map((o) => ({
      ...o,
      item: { ...o.item },
      delivery: { ...o.delivery },
      fee: { ...o.fee },
      disbursement: { ...o.disbursement },
    })),
    payouts: seed.payouts.map((p) => ({ ...p, amount: { ...p.amount } })),
    notifications: seed.notifications.map((n) => ({ ...n, subject: { ...n.subject } })),
    payoutSeq: 99410,
  };
}

/** Module-level store — one source of truth for every dashboard view. */
let state: MutableState = cloneSeed();

/** Test helper: reset to HTML seed. */
export function resetDashboardStore() {
  state = cloneSeed();
}

function currency() {
  return state.shop.currency;
}

function listOrders(query: OrderListQuery = {}): OrderListResult {
  const pageSize = query.pageSize ?? DEFAULT_ORDER_PAGE_SIZE;
  const page = Math.max(1, query.page ?? 1);
  const filtered = filterOrders(state.orders, state.products, {
    filter: query.filter,
    q: query.q,
  });
  const start = (page - 1) * pageSize;
  return {
    rows: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    counts: orderFilterCounts(state.orders),
  };
}

function homeSnapshot(): HomeSnapshot {
  const { shop, orders } = state;
  const held = orders.find((o) => o.status === "held") ?? null;
  const delivered = countByStatus(orders, "paid");
  const problems = countByStatus(orders, "problem");

  return {
    shop,
    availableBalance: shop.availableBalance,
    heldBalance: heldTotal(orders, shop.currency),
    needsYouOrder: held,
    recentOrders: orders.slice(0, 4),
    kpis: {
      viewsWeek: 430,
      viewsDeltaPct: 18,
      ordersTotal: orders.length,
      ordersDelta: 2,
      delivered,
      problems,
    },
    sellerScore: {
      deliveredConfirmed: delivered,
      deliveredTarget: Math.max(delivered, 1),
      holdProgressPct: 60,
      ordersUntilShorterHold: 2,
    },
    sparkline: HOME_SPARKLINE,
    sparklineHighlightIndex: HOME_SPARKLINE_HIGHLIGHT,
  };
}

function moneySnapshot(): MoneySnapshot {
  const { shop, orders, payouts } = state;
  return {
    shop,
    availableBalance: shop.availableBalance,
    heldBalance: heldTotal(orders, shop.currency),
    lifetimePaid: lifetimePaid(payouts, shop.currency),
    monthSales: monthSales(orders, shop.currency),
    payouts: [...payouts],
    plan: shop.plan,
  };
}

export const mockDashboardService: DashboardService = {
  async getShop() {
    return state.shop;
  },

  async getProducts() {
    return [...state.products];
  },

  async getProduct(id) {
    return state.products.find((p) => p.id === id) ?? null;
  },

  async getOrders(query) {
    return listOrders(query);
  },

  async getOrder(id) {
    return state.orders.find((o) => o.id === id) ?? null;
  },

  async getPayouts() {
    return [...state.payouts];
  },

  async getNotifications() {
    return [...state.notifications];
  },

  async getHomeSnapshot() {
    return homeSnapshot();
  },

  async getMoneySnapshot() {
    return moneySnapshot();
  },

  async getNeedsYouCount() {
    return needsYouCount(state.orders);
  },

  async search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return { orders: [], products: [] };
    const orders = filterOrders(state.orders, state.products, { q });
    const products = state.products.filter((p) => p.name.toLowerCase().includes(q));
    return { orders, products };
  },

  async releaseOrder(orderId, code, opts) {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return { ok: false, error: "not_found" } satisfies ReleaseOrderResult;

    if (order.status !== "held" && order.status !== "transit") {
      return { ok: false, error: "not_releasable" };
    }

    const limit = checkRateLimit({
      key: `delivery-code:${orderId}:${opts?.ip ?? "local"}`,
      ...RATE_LIMITS.deliveryCodePerOrder,
    });
    if (!limit.allowed) {
      return { ok: false, error: "rate_limited", retryAfterMs: limit.retryAfterMs };
    }

    if (code.trim() !== order.deliveryCode) {
      return { ok: false, error: "wrong_code" };
    }

    const settledSeconds = 4;
    const net = orderNet(order);
    const updated: DashboardOrder = {
      ...order,
      status: "paid",
      whenLabel: "Just now",
      settledSeconds,
    };
    state.orders = state.orders.map((o) => (o.id === orderId ? updated : o));

    const payout: DashboardPayout = {
      id: `PO-${state.payoutSeq++}`,
      whenLabel: "Just now",
      amount: net,
      orderId,
      settledSeconds,
    };
    state.payouts = [payout, ...state.payouts];

    state.shop = {
      ...state.shop,
      availableBalance: {
        amountMinor: state.shop.availableBalance.amountMinor + net.amountMinor,
        currency: currency(),
      },
    };

    return { ok: true, order: updated, payout };
  },

  async reportOrderProblem(orderId, reason) {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return { ok: false, error: "not_found" };
    state.orders = state.orders.map((o) =>
      o.id === orderId
        ? { ...o, status: "problem" as const, problemReason: reason }
        : o,
    );
    return { ok: true };
  },

  async saveProduct(input: SaveProductInput) {
    const existing = state.products.find((p) => p.id === input.id);
    if (!existing) return { ok: false, error: "not_found" };

    const name = input.name.trim();
    if (!name || input.priceMinor <= 0 || input.stock < 0) {
      return { ok: false, error: "validation" };
    }

    const status = resolveProductStatus(input.stock, input.onSale);
    const product: DashboardProduct = {
      ...existing,
      name,
      price: { amountMinor: input.priceMinor, currency: currency() },
      stock: input.stock,
      description: input.description,
      status,
    };
    state.products = state.products.map((p) => (p.id === input.id ? product : p));
    return { ok: true, product };
  },

  async deleteProduct(id) {
    if (!state.products.some((p) => p.id === id)) return { ok: false, error: "not_found" };
    state.products = state.products.filter((p) => p.id !== id);
    return { ok: true };
  },

  async saveShopSettings(input: SaveShopSettingsInput) {
    const name = input.name.trim() || state.shop.name;
    const slug = sanitiseSlug(input.slug) || state.shop.slug;
    const city = input.city.trim() || state.shop.city;
    state.shop = {
      ...state.shop,
      name,
      slug,
      city,
      lang: input.lang,
      deliveryEnabled: input.deliveryEnabled,
      pickupEnabled: input.pickupEnabled,
      notifySms: input.notifySms,
      notifyWa: input.notifyWa,
    };
    return { ok: true, shop: state.shop };
  },

  async switchPlan(plan: ShopPlan) {
    state.shop = { ...state.shop, plan };
    return { ok: true, shop: state.shop };
  },

  async startBoost(input) {
    const product = state.products.find((p) => p.id === input.productId);
    if (!product) return { ok: false, error: "not_found" };
    if (input.budgetMinor <= 0) return { ok: false, error: "validation" };
    return { ok: true };
  },
};

export function getProductForOrder(order: DashboardOrder): DashboardProduct {
  return findProduct(state.products, order.productId, currency());
}

export function productIsOnSale(product: DashboardProduct): boolean {
  return isProductOnSale(product.status);
}
