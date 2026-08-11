import { CHECKOUT_SESSION_TTL_MS, createBuyerSeed } from "@/lib/buyer/mock";
import {
  calcLineTotal,
  clampQty,
  findArea,
  isPurchasable,
} from "@/lib/buyer/pricing";
import { SHOP_HOST } from "@/lib/publish/mock";
import { checkRateLimit } from "@/lib/rate-limit";
import type {
  AddDisputeDetailResult,
  AdvanceOrderResult,
  BuyerCatalogueItem,
  BuyerCheckoutPage,
  BuyerCheckoutSession,
  BuyerOrder,
  BuyerOrderEvent,
  BuyerProblemReason,
  BuyerProduct,
  BuyerProductPage,
  BuyerRating,
  BuyerService,
  BuyerShop,
  BuyerShopPage,
  CancelHeldOrderResult,
  ConfirmReceivedResult,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  NotifyRestockInput,
  NotifyRestockResult,
  PlaceBuyerOrderInput,
  PlaceBuyerOrderResult,
  ReportBuyerProblemResult,
  ReportListingInput,
  ReportListingResult,
  RateOrderResult,
  StartMomoPaymentResult,
} from "@/types/buyer";
import { formatMoney } from "@/lib/money";
import { nanoid } from "nanoid";

const PROBLEM_COPY: Record<BuyerProblemReason, string> = {
  neverArrived: "It never arrived.",
  notAsDescribed: "It arrived but it is not what was described.",
  damaged: "It arrived damaged.",
  missing: "Part of the order is missing.",
  codeEarly: "Someone asked me for my code before delivery.",
};

function maskPhone(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length < 6) return `+250 ${d}`;
  return `+250 ${d.slice(0, 3)} ••• ${d.slice(-3)}`;
}

function paymentMethodLabel(method: PlaceBuyerOrderInput["paymentMethod"]): string {
  switch (method) {
    case "mtn":
      return "MTN Mobile Money";
    case "airtel":
      return "Airtel Money";
    case "cod":
      return "Cash on delivery";
    case "card":
      return "Card";
  }
}

function sellerFirst(name: string): string {
  return name.split(" ")[0] ?? name;
}

function seedDemoOrder1042(shop: BuyerShop, product: BuyerProduct): BuyerOrder {
  const phone = "788902771";
  const total = { amountMinor: 9700, currency: shop.currency };
  return {
    id: "1042",
    slug: shop.slug,
    productId: product.id,
    productTitle: product.title,
    shortLabel: product.shortLabel,
    variant: "Blue",
    qty: 1,
    item: { amountMinor: 8500, currency: shop.currency },
    delivery: { amountMinor: 1200, currency: shop.currency },
    total,
    status: "held",
    deliveryCode: "5083",
    buyerName: "Jean-Paul K.",
    buyerPhone: phone,
    buyerPhoneMasked: maskPhone(phone),
    deliveryMode: "deliver",
    areaId: "kimironko",
    areaLabel: "Kimironko",
    landmark: "Near the market",
    paymentMethod: "mtn",
    payPhone: phone,
    paymentLabel: `MTN · ${maskPhone(phone)}`,
    sellerName: shop.name,
    sellerFirstName: sellerFirst(shop.name),
    palette: product.images[0]?.palette ?? 0,
    beads: product.images[0]?.beads ?? 15,
    createdAt: Date.now() - 6 * 60 * 1000,
    deliveryWindowTitle: "Today, between 2pm and 6pm",
    deliveryWindowNote:
      "Amara usually ships the same day. You will get an SMS when the courier collects it.",
    events: [
      {
        id: "e1",
        title: `You paid ${formatMoney(total, "en")}`,
        subtitle: "MTN Mobile Money · reference 8842-1190",
        whenLabel: "14:02",
        tone: "ok",
      },
      {
        id: "e2",
        title: "Held by SolAI",
        subtitle: "Against order #1042. Not released to the seller.",
        whenLabel: "14:02",
        tone: "hold",
      },
      {
        id: "e3",
        title: "Your code was sent",
        subtitle: `By SMS to ${maskPhone(phone)}`,
        whenLabel: "14:02",
        tone: "ok",
      },
      {
        id: "e4",
        title: "Amara was told",
        subtitle: "She is packing it now",
        whenLabel: "14:05",
        tone: "ok",
      },
      {
        id: "e5",
        title: "Courier collects",
        subtitle: "You will get an SMS",
        whenLabel: "—",
        tone: "wait",
      },
      {
        id: "e6",
        title: "You give the code",
        subtitle: "That is when Amara is paid",
        whenLabel: "—",
        tone: "wait",
      },
    ],
  };
}

type Reservation = Readonly<{
  sessionId: string;
  productId: string;
  qty: number;
}>;

type MutableState = {
  shop: BuyerShop;
  products: BuyerProduct[];
  sessions: Map<string, BuyerCheckoutSession>;
  reservations: Map<string, Reservation>;
  orders: Map<string, BuyerOrder>;
  orderSeq: number;
  restockNotices: { productId: string; phoneDigits: string; at: number }[];
  listingReports: { productId: string; reason: string; at: number }[];
};

function cloneSeed(): MutableState {
  const seed = createBuyerSeed();
  const shop = {
    ...seed.shop,
    deliveryFrom: { ...seed.shop.deliveryFrom },
    deliveryAreas: seed.shop.deliveryAreas.map((a) => ({
      ...a,
      fee: { ...a.fee },
    })),
    recentDeliveries: [...seed.shop.recentDeliveries],
    seller: { ...seed.shop.seller },
  };
  const products = seed.products.map((p) => ({
    ...p,
    price: { ...p.price },
    variants: [...p.variants],
    images: p.images.map((im) => ({ ...im })),
  }));
  const orders = new Map<string, BuyerOrder>();
  const p1 = products.find((p) => p.id === "p1");
  if (p1) orders.set("1042", seedDemoOrder1042(shop, p1));

  return {
    shop,
    products,
    sessions: new Map(),
    reservations: new Map(),
    orders,
    orderSeq: 1050,
    restockNotices: [],
    listingReports: [],
  };
}

let state: MutableState = cloneSeed();

/** Test helper. */
export function resetBuyerStore() {
  state = cloneSeed();
}

function catalogueFor(products: readonly BuyerProduct[]): BuyerCatalogueItem[] {
  return products
    .filter((p) => p.status !== "removed")
    .map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      status: p.status,
      palette: p.images[0]?.palette ?? 0,
    }));
}

function shopPage(): BuyerShopPage {
  const catalogue = catalogueFor(state.products);
  return {
    shop: state.shop,
    catalogue,
    liveCount: catalogue.filter((c) => c.status === "live").length,
  };
}

/** Demo aliases → canonical shop slug (shared Amara seed). */
const SLUG_ALIASES: Record<string, string> = {
  "amara-beads": "amara",
};

function resolveSlug(slug: string): string {
  return SLUG_ALIASES[slug] ?? slug;
}

function findShop(slug: string): BuyerShop | null {
  return state.shop.slug === resolveSlug(slug) ? state.shop : null;
}

function findProduct(productId: string): BuyerProduct | undefined {
  return state.products.find((p) => p.id === productId);
}

function productPage(product: BuyerProduct): BuyerProductPage {
  return {
    shop: state.shop,
    product,
    catalogue: catalogueFor(state.products),
  };
}

function readSession(sessionId: string): BuyerCheckoutSession | null {
  const session = state.sessions.get(sessionId);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    releaseReservation(sessionId);
    state.sessions.delete(sessionId);
    return null;
  }
  return session;
}

function availableStock(product: BuyerProduct, exceptSessionId?: string): number {
  let reserved = 0;
  for (const r of state.reservations.values()) {
    if (r.productId !== product.id) continue;
    if (exceptSessionId && r.sessionId === exceptSessionId) continue;
    reserved += r.qty;
  }
  return Math.max(0, product.stock - reserved);
}

function releaseReservation(sessionId: string) {
  state.reservations.delete(sessionId);
}

function softReserve(session: BuyerCheckoutSession): boolean {
  const product = findProduct(session.productId);
  if (!product || !isPurchasable(product)) return false;
  const available = availableStock(product, session.id);
  if (session.qty > available) return false;
  state.reservations.set(session.id, {
    sessionId: session.id,
    productId: product.id,
    qty: session.qty,
  });
  return true;
}

function fourDigitCode(): string {
  return String(1000 + Math.floor(Math.random() * 9000));
}

function buildOrder(
  input: PlaceBuyerOrderInput,
  session: BuyerCheckoutSession,
  product: BuyerProduct,
): BuyerOrder | null {
  const area =
    input.deliveryMode === "pickup"
      ? { id: "pickup", label: "Pickup", fee: { amountMinor: 0, currency: product.price.currency } }
      : findArea(state.shop.deliveryAreas, input.areaId);
  if (!area) return null;

  const ship =
    input.deliveryMode === "pickup"
      ? { amountMinor: 0, currency: product.price.currency }
      : { ...area.fee };
  const totals = calcLineTotal(product.price, session.qty, ship);
  const id = String(state.orderSeq++);
  const code = fourDigitCode();
  const image = product.images[0];
  const phone = input.buyerPhone.replace(/\D/g, "");
  const payPhone = input.payPhone.replace(/\D/g, "") || phone;
  const payLabel = paymentMethodLabel(input.paymentMethod);
  const events: BuyerOrderEvent[] = [
    {
      id: "e1",
      title:
        input.paymentMethod === "cod"
          ? "Order placed · cash on delivery"
          : `You paid ${formatMoney(totals.total, "en")}`,
      subtitle:
        input.paymentMethod === "cod"
          ? "Nothing charged yet — cash at the door"
          : `${payLabel} · just now`,
      whenLabel: "Just now",
      tone: "ok",
    },
    {
      id: "e2",
      title: "Held by SolAI",
      subtitle: `Against order #${id}. Not released to the seller.`,
      whenLabel: "Just now",
      tone: "hold",
    },
    {
      id: "e3",
      title: "Your code was sent",
      subtitle: `By SMS to ${maskPhone(phone)}`,
      whenLabel: "Just now",
      tone: "ok",
    },
    {
      id: "e4",
      title: `${sellerFirst(state.shop.name)} was told`,
      subtitle: "She is packing it now",
      whenLabel: "Just now",
      tone: "ok",
    },
    {
      id: "e5",
      title: "Courier collects",
      subtitle: "You will get an SMS",
      whenLabel: "—",
      tone: "wait",
    },
    {
      id: "e6",
      title: "You give the code",
      subtitle: `That is when ${sellerFirst(state.shop.name)} is paid`,
      whenLabel: "—",
      tone: "wait",
    },
  ];

  return {
    id,
    slug: session.slug,
    productId: product.id,
    productTitle: product.title,
    shortLabel: product.shortLabel,
    variant: session.variant,
    qty: session.qty,
    item: totals.itemLine,
    delivery: totals.ship,
    total: totals.total,
    status: "held",
    deliveryCode: code,
    buyerName: input.buyerName.trim(),
    buyerPhone: phone,
    buyerPhoneMasked: maskPhone(phone),
    deliveryMode: input.deliveryMode,
    areaId: area.id,
    areaLabel: area.label,
    landmark: input.landmark.trim(),
    paymentMethod: input.paymentMethod,
    payPhone,
    paymentLabel: `${payLabel} · ${maskPhone(payPhone)}`,
    sellerName: state.shop.name,
    sellerFirstName: sellerFirst(state.shop.name),
    palette: image?.palette ?? 0,
    beads: image?.beads ?? 12,
    createdAt: Date.now(),
    events,
    deliveryWindowTitle: "Today, between 2pm and 6pm",
    deliveryWindowNote: `${sellerFirst(state.shop.name)} usually ships the same day. You will get an SMS when the courier collects it.`,
  };
}

function mutateOrder(orderId: string, next: BuyerOrder) {
  state.orders.set(orderId, next);
}

function commitStock(productId: string, qty: number) {
  const product = findProduct(productId);
  if (!product) return;
  const nextStock = Math.max(0, product.stock - qty);
  const idx = state.products.findIndex((p) => p.id === productId);
  if (idx < 0) return;
  state.products[idx] = {
    ...product,
    stock: nextStock,
    status: nextStock === 0 ? "oos" : product.status,
  };
}

function resolvePlaceInput(
  input: PlaceBuyerOrderInput,
): {
  session: BuyerCheckoutSession;
  product: BuyerProduct;
} | null {
  const session = readSession(input.sessionId);
  if (!session) return null;
  if (!findShop(session.slug)) return null;
  const product = findProduct(session.productId);
  if (!product) return null;
  return { session, product };
}

function validateBuyerFields(input: PlaceBuyerOrderInput): boolean {
  if (!input.buyerName.trim()) return false;
  if (input.buyerPhone.replace(/\D/g, "").length < 9) return false;
  if (input.paymentMethod === "mtn" || input.paymentMethod === "airtel") {
    if (input.payPhone.replace(/\D/g, "").length < 9) return false;
  }
  if (input.deliveryMode === "deliver" && !input.areaId) return false;
  return true;
}

export const mockBuyerService: BuyerService = {
  async getShopBySlug(slug) {
    if (!findShop(slug)) return null;
    return shopPage();
  },

  async getProduct(slug, productId) {
    if (!findShop(slug)) return null;
    const product = findProduct(productId);
    if (!product || product.status === "removed") return null;
    return productPage(product);
  },

  async getProductOrGone(slug, productId) {
    if (!findShop(slug)) return null;
    const product = findProduct(productId);
    const catalogue = catalogueFor(state.products);
    if (!product || product.status === "removed") {
      return { kind: "gone", shop: state.shop, catalogue };
    }
    return { kind: "product", page: productPage(product) };
  },

  async createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult> {
    if (!findShop(input.slug)) return { ok: false, reason: "not_found" };
    const product = findProduct(input.productId);
    if (!product) return { ok: false, reason: "not_found" };
    if (product.status === "removed") return { ok: false, reason: "removed" };
    if (!isPurchasable(product)) return { ok: false, reason: "oos" };

    const area = findArea(state.shop.deliveryAreas, input.areaId);
    if (!area) return { ok: false, reason: "invalid" };

    const variant = product.variants.includes(input.variant)
      ? input.variant
      : product.variants[0];
    if (!variant) return { ok: false, reason: "invalid" };

    const qty = clampQty(input.qty, availableStock(product));
    if (qty < 1) return { ok: false, reason: "oos" };

    const now = Date.now();
    const id = nanoid(10);
    const session: BuyerCheckoutSession = {
      id,
      slug: state.shop.slug,
      productId: product.id,
      variant,
      qty,
      areaId: area.id,
      ship: { ...area.fee },
      itemUnit: { ...product.price },
      createdAt: now,
      expiresAt: now + CHECKOUT_SESSION_TTL_MS,
    };
    state.sessions.set(id, session);

    return {
      ok: true,
      sessionId: id,
      checkoutPath: `/${state.shop.slug}/checkout?c=${id}`,
    };
  },

  async getCheckoutSession(sessionId) {
    return readSession(sessionId);
  },

  async getCheckoutPage(slug, sessionId): Promise<BuyerCheckoutPage | null> {
    const shop = findShop(slug);
    if (!shop) return null;
    const session = readSession(sessionId);
    if (!session || resolveSlug(session.slug) !== shop.slug) return null;
    const product = findProduct(session.productId);
    if (!product || product.status === "removed") return null;
    return { shop, product, session };
  },

  async notifyRestock(input: NotifyRestockInput): Promise<NotifyRestockResult> {
    if (!findShop(input.slug)) return { ok: false, reason: "not_found" };
    const product = findProduct(input.productId);
    if (!product) return { ok: false, reason: "not_found" };
    const digits = input.phoneDigits.replace(/\D/g, "");
    if (digits.length < 8) return { ok: false, reason: "invalid_phone" };
    state.restockNotices.push({
      productId: product.id,
      phoneDigits: digits,
      at: Date.now(),
    });
    return { ok: true };
  },

  async reportListing(input: ReportListingInput): Promise<ReportListingResult> {
    state.listingReports.push({
      productId: input.productId,
      reason: input.reason,
      at: Date.now(),
    });
    return { ok: true };
  },

  async startMomoPayment(input): Promise<StartMomoPaymentResult> {
    const limit = checkRateLimit({
      key: `momo:${input.sessionId}`,
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.allowed) return { ok: false, reason: "rate_limited" };
    if (!validateBuyerFields(input)) return { ok: false, reason: "invalid" };
    if (input.paymentMethod === "cod") return { ok: false, reason: "invalid" };

    const resolved = resolvePlaceInput(input);
    if (!resolved) return { ok: false, reason: "session_expired" };
    const { session, product } = resolved;
    if (!isPurchasable(product)) return { ok: false, reason: "oos" };
    if (!softReserve(session)) return { ok: false, reason: "oos" };

    const promptPhone =
      input.payPhone.replace(/\D/g, "") || input.buyerPhone.replace(/\D/g, "");
    return { ok: true, promptPhone };
  },

  async cancelMomoPayment(sessionId) {
    releaseReservation(sessionId);
    return { ok: true };
  },

  async confirmPayment(input): Promise<PlaceBuyerOrderResult> {
    if (!validateBuyerFields(input)) return { ok: false, reason: "invalid" };
    if (input.paymentMethod === "cod") return { ok: false, reason: "invalid" };

    const resolved = resolvePlaceInput(input);
    if (!resolved) return { ok: false, reason: "session_expired" };
    const { session, product } = resolved;

    if (!state.reservations.has(session.id)) {
      if (!softReserve(session)) return { ok: false, reason: "oos" };
    }

    const order = buildOrder(input, session, product);
    if (!order) return { ok: false, reason: "invalid" };

    commitStock(product.id, session.qty);
    releaseReservation(session.id);
    state.orders.set(order.id, order);
    state.sessions.delete(session.id);

    return { ok: true, orderId: order.id, orderPath: `/order/${order.id}` };
  },

  async placeCodOrder(input): Promise<PlaceBuyerOrderResult> {
    if (!validateBuyerFields(input)) return { ok: false, reason: "invalid" };
    if (input.paymentMethod !== "cod") return { ok: false, reason: "invalid" };

    const resolved = resolvePlaceInput(input);
    if (!resolved) return { ok: false, reason: "session_expired" };
    const { session, product } = resolved;
    if (!isPurchasable(product)) return { ok: false, reason: "oos" };
    if (session.qty > availableStock(product)) return { ok: false, reason: "oos" };

    const order = buildOrder(input, session, product);
    if (!order) return { ok: false, reason: "invalid" };

    commitStock(product.id, session.qty);
    releaseReservation(session.id);
    state.orders.set(order.id, order);
    state.sessions.delete(session.id);

    return { ok: true, orderId: order.id, orderPath: `/order/${order.id}` };
  },

  async getOrder(orderId) {
    return state.orders.get(orderId) ?? null;
  },

  async confirmReceived(input): Promise<ConfirmReceivedResult> {
    const order = state.orders.get(input.orderId);
    if (!order) return { ok: false, reason: "not_found" };
    if (order.status !== "held" && order.status !== "transit") {
      return { ok: false, reason: "bad_status" };
    }
    const last4 = input.phoneLast4.replace(/\D/g, "");
    if (last4.length !== 4) return { ok: false, reason: "invalid" };
    if (!order.buyerPhone.endsWith(last4)) return { ok: false, reason: "wrong_phone" };

    const nowLabel = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    mutateOrder(order.id, {
      ...order,
      status: "done",
      codeAcceptedLabel: nowLabel,
      events: [
        ...order.events.filter((e) => e.tone !== "wait"),
        {
          id: "e-done",
          title: "You confirmed receipt",
          subtitle: `Code path · ${sellerFirst(order.sellerName)} paid`,
          whenLabel: nowLabel,
          tone: "ok",
        },
      ],
    });
    return { ok: true };
  },

  async reportProblem(input): Promise<ReportBuyerProblemResult> {
    const order = state.orders.get(input.orderId);
    if (!order) return { ok: false, reason: "not_found" };
    if (order.status !== "held" && order.status !== "transit") {
      return { ok: false, reason: "bad_status" };
    }
    const caseId = `D-${2000 + Math.floor(Math.random() * 8000)}`;
    mutateOrder(order.id, {
      ...order,
      status: "disputed",
      dispute: {
        caseId,
        reason: PROBLEM_COPY[input.reason],
        slaDeadlineAt: Date.now() + 48 * 60 * 60 * 1000,
      },
      events: [
        ...order.events,
        {
          id: "e-dispute",
          title: "Problem reported",
          subtitle: "Money stays held until a person reads this",
          whenLabel: "Just now",
          tone: "bad",
        },
      ],
    });
    return { ok: true, caseId };
  },

  async cancelHeldOrder(orderId): Promise<CancelHeldOrderResult> {
    const order = state.orders.get(orderId);
    if (!order) return { ok: false, reason: "not_found" };
    if (order.status !== "held") return { ok: false, reason: "bad_status" };
    mutateOrder(order.id, {
      ...order,
      status: "refunded",
      refund: {
        toLabel: order.paymentLabel,
        sentLabel: "Just now",
        arrivesLabel: "Under a minute",
      },
      events: [
        ...order.events,
        {
          id: "e-cancel",
          title: "Order cancelled",
          subtitle: "Refunded to the wallet you paid from",
          whenLabel: "Just now",
          tone: "ok",
        },
      ],
    });
    return { ok: true };
  },

  async rateOrder(orderId, rating: BuyerRating): Promise<RateOrderResult> {
    const order = state.orders.get(orderId);
    if (!order) return { ok: false, reason: "not_found" };
    if (order.status !== "done") return { ok: false, reason: "bad_status" };
    mutateOrder(order.id, { ...order, rating });
    return { ok: true };
  },

  async addDisputeDetail(orderId, detail): Promise<AddDisputeDetailResult> {
    const order = state.orders.get(orderId);
    if (!order?.dispute) return { ok: false, reason: "not_found" };
    if (order.status !== "disputed") return { ok: false, reason: "bad_status" };
    mutateOrder(order.id, {
      ...order,
      dispute: { ...order.dispute, detail: detail.trim() },
    });
    return { ok: true };
  },

  async markCourierCollected(orderId): Promise<AdvanceOrderResult> {
    const order = state.orders.get(orderId);
    if (!order) return { ok: false, reason: "not_found" };
    if (order.status !== "held") return { ok: false, reason: "bad_status" };
    mutateOrder(order.id, {
      ...order,
      status: "transit",
      courier: {
        name: "Eric M.",
        initials: "EM",
        vehicleLabel: "moto courier",
        collectedLabel: "MT-114 · collected 14:20 · about 15 minutes away",
        etaLabel: order.areaLabel,
        trackPct: 62,
      },
      events: [
        ...order.events.filter((e) => e.tone !== "wait"),
        {
          id: "e-collect",
          title: "Courier collected it",
          subtitle: "Eric M. · MT-114",
          whenLabel: "14:20",
          tone: "ok",
        },
        {
          id: "e-door",
          title: "You give the code at the door",
          subtitle: `That is when ${order.sellerFirstName} is paid`,
          whenLabel: "—",
          tone: "wait",
        },
      ],
    });
    return { ok: true };
  },
};

export function shopPublicUrl(slug: string): string {
  return `${SHOP_HOST}/${slug}`;
}

export function productPublicPath(slug: string, productId: string): string {
  return `/${slug}/p/${productId}`;
}

export function orderPublicPath(orderId: string): string {
  return `/order/${orderId}`;
}
