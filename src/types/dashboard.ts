import type { CurrencyCode, Money } from "@/types/money";

/** Order lifecycle states used across every dashboard surface. */
export type OrderStatus = "held" | "transit" | "paid" | "problem";

export type ProductStatus = "live" | "oos" | "draft";

export type StatusChipTone = "held" | "live" | "line" | "clay" | "grey" | "sun";

export type ShopPlan = "free" | "plus";

export type OrderFilter = "all" | OrderStatus;

export type NotificationKind = "berry" | "sea" | "clay";

export type NotificationSubject =
  | Readonly<{ type: "order"; orderId: string }>
  | Readonly<{ type: "product"; productId: string }>
  | Readonly<{ type: "money" }>
  | Readonly<{ type: "grow" }>
  | Readonly<{ type: "settings" }>;

export type DashboardShop = Readonly<{
  id: string;
  /** Links settings “change wallet” back into the existing payout flow. */
  draftId: string;
  name: string;
  slug: string;
  city: string;
  currency: CurrencyCode;
  plan: ShopPlan;
  lang: string;
  walletLabel: string;
  walletMasked: string;
  holderName: string;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  notifySms: boolean;
  notifyWa: boolean;
  /** Spendable balance already in the seller’s wallet — not a derived field. */
  availableBalance: Money;
}>;

export type DashboardProduct = Readonly<{
  id: string;
  name: string;
  price: Money;
  stock: number;
  status: ProductStatus;
  views: number;
  sold: number;
  /** Palette index for placeholder artwork until real images land. */
  palette: number;
  description: string;
}>;

export type DashboardOrder = Readonly<{
  id: string;
  buyerName: string;
  buyerArea: string;
  productId: string;
  qty: number;
  item: Money;
  delivery: Money;
  fee: Money;
  disbursement: Money;
  status: OrderStatus;
  whenLabel: string;
  courierLabel: string;
  deliveryCode: string;
  /** Seconds to settle after release; present on paid orders. */
  settledSeconds?: number;
  problemReason?: string;
}>;

export type DashboardPayout = Readonly<{
  id: string;
  whenLabel: string;
  amount: Money;
  orderId: string;
  settledSeconds: number;
}>;

export type DashboardNotification = Readonly<{
  id: string;
  title: string;
  subtitle: string;
  subject: NotificationSubject;
  kind: NotificationKind;
  read: boolean;
}>;

export type OrderListQuery = Readonly<{
  filter?: OrderFilter;
  q?: string;
  page?: number;
  pageSize?: number;
}>;

export type OrderListResult = Readonly<{
  rows: readonly DashboardOrder[];
  total: number;
  page: number;
  pageSize: number;
  counts: Readonly<Record<OrderFilter, number>>;
}>;

export type HomeSnapshot = Readonly<{
  shop: DashboardShop;
  availableBalance: Money;
  heldBalance: Money;
  needsYouOrder: DashboardOrder | null;
  recentOrders: readonly DashboardOrder[];
  kpis: Readonly<{
    viewsWeek: number;
    viewsDeltaPct: number;
    ordersTotal: number;
    ordersDelta: number;
    delivered: number;
    problems: number;
  }>;
  sellerScore: Readonly<{
    deliveredConfirmed: number;
    deliveredTarget: number;
    holdProgressPct: number;
    ordersUntilShorterHold: number;
  }>;
  sparkline: readonly number[];
  sparklineHighlightIndex: number;
}>;

export type MoneySnapshot = Readonly<{
  shop: DashboardShop;
  availableBalance: Money;
  heldBalance: Money;
  lifetimePaid: Money;
  monthSales: Money;
  payouts: readonly DashboardPayout[];
  plan: ShopPlan;
}>;

export type ReleaseOrderResult =
  | Readonly<{ ok: true; order: DashboardOrder; payout: DashboardPayout }>
  | Readonly<{ ok: false; error: "not_found" | "wrong_code" | "not_releasable" | "rate_limited"; retryAfterMs?: number }>;

export type SaveProductInput = Readonly<{
  id: string;
  name: string;
  priceMinor: number;
  stock: number;
  description: string;
  onSale: boolean;
}>;

export type SaveShopSettingsInput = Readonly<{
  name: string;
  slug: string;
  city: string;
  lang: string;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  notifySms: boolean;
  notifyWa: boolean;
}>;

export type DashboardService = {
  getShop(): Promise<DashboardShop>;
  getProducts(): Promise<readonly DashboardProduct[]>;
  getProduct(id: string): Promise<DashboardProduct | null>;
  getOrders(query?: OrderListQuery): Promise<OrderListResult>;
  getOrder(id: string): Promise<DashboardOrder | null>;
  getPayouts(): Promise<readonly DashboardPayout[]>;
  getNotifications(): Promise<readonly DashboardNotification[]>;
  getHomeSnapshot(): Promise<HomeSnapshot>;
  getMoneySnapshot(): Promise<MoneySnapshot>;
  /** Derived badge: held + problem. Never total orders. */
  getNeedsYouCount(): Promise<number>;
  search(query: string): Promise<{
    orders: readonly DashboardOrder[];
    products: readonly DashboardProduct[];
  }>;

  releaseOrder(orderId: string, code: string, opts?: { ip?: string }): Promise<ReleaseOrderResult>;
  reportOrderProblem(orderId: string, reason: string): Promise<{ ok: true } | { ok: false; error: "not_found" }>;
  saveProduct(input: SaveProductInput): Promise<
    { ok: true; product: DashboardProduct } | { ok: false; error: "not_found" | "validation" }
  >;
  deleteProduct(id: string): Promise<{ ok: true } | { ok: false; error: "not_found" }>;
  saveShopSettings(input: SaveShopSettingsInput): Promise<{ ok: true; shop: DashboardShop }>;
  switchPlan(plan: ShopPlan): Promise<{ ok: true; shop: DashboardShop }>;
  startBoost(input: {
    productId: string;
    budgetMinor: number;
  }): Promise<{ ok: true } | { ok: false; error: "not_found" | "validation" }>;
};
