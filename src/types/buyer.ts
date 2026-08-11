import type { CurrencyCode, Money } from "@/types/money";

/** Buyer-facing listing lifecycle (drives storefront states). */
export type BuyerListingStatus = "live" | "oos" | "removed";

export type BuyerImageKind = "own" | "ai";

export type BuyerProductImage = Readonly<{
  kind: BuyerImageKind;
  /** Short caption under the gallery (“taken by the seller”, “styled · …”). */
  label: string;
  palette: number;
  beads: number;
}>;

export type BuyerDeliveryArea = Readonly<{
  id: string;
  label: string;
  fee: Money;
}>;

export type BuyerSellerRecord = Readonly<{
  initials: string;
  sellingSinceLabel: string;
  deliveredLabel: string;
  confirmedPctLabel: string;
  shipsLabel: string;
  repliesLabel: string;
  isNewerSeller: boolean;
  verifiedWallet: boolean;
}>;

export type BuyerConfirmedDelivery = Readonly<{
  id: string;
  buyerInitial: string;
  area: string;
  whenLabel: string;
}>;

export type BuyerShop = Readonly<{
  id: string;
  name: string;
  slug: string;
  city: string;
  currency: CurrencyCode;
  tagline: string;
  whatsappPrefillName: string;
  seller: BuyerSellerRecord;
  recentDeliveries: readonly BuyerConfirmedDelivery[];
  deliveryAreas: readonly BuyerDeliveryArea[];
  deliveryFrom: Money;
}>;

export type BuyerProduct = Readonly<{
  id: string;
  shopId: string;
  title: string;
  eyebrow: string;
  description: string;
  price: Money;
  stock: number;
  status: BuyerListingStatus;
  variants: readonly string[];
  images: readonly BuyerProductImage[];
  shortLabel: string;
}>;

export type BuyerCatalogueItem = Readonly<{
  id: string;
  title: string;
  price: Money;
  status: BuyerListingStatus;
  palette: number;
}>;

/** Soft checkout intent created from the sticky Buy now CTA. */
export type BuyerCheckoutSession = Readonly<{
  id: string;
  slug: string;
  productId: string;
  variant: string;
  qty: number;
  areaId: string;
  ship: Money;
  itemUnit: Money;
  createdAt: number;
  expiresAt: number;
}>;

export type CreateCheckoutSessionInput = Readonly<{
  slug: string;
  productId: string;
  variant: string;
  qty: number;
  areaId: string;
}>;

export type CreateCheckoutSessionResult =
  | Readonly<{ ok: true; sessionId: string; checkoutPath: string }>
  | Readonly<{ ok: false; reason: "not_found" | "oos" | "removed" | "invalid" }>;

export type NotifyRestockInput = Readonly<{
  slug: string;
  productId: string;
  phoneDigits: string;
}>;

export type NotifyRestockResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: "invalid_phone" | "not_found" }>;

export type ReportListingReason =
  | "counterfeit"
  | "stolenPhotos"
  | "misleading"
  | "illegal"
  | "other";

export type ReportListingInput = Readonly<{
  slug: string;
  productId: string;
  reason: ReportListingReason;
}>;

export type ReportListingResult = Readonly<{ ok: true }>;

export type BuyerPaymentMethod = "mtn" | "airtel" | "cod" | "card";

export type BuyerDeliveryMode = "deliver" | "pickup";

export type BuyerOrderStatus =
  | "held"
  | "transit"
  | "done"
  | "disputed"
  | "refunded";

export type BuyerOrderEventTone = "ok" | "hold" | "wait" | "bad";

export type BuyerOrderEvent = Readonly<{
  id: string;
  title: string;
  subtitle: string;
  whenLabel: string;
  tone: BuyerOrderEventTone;
}>;

export type BuyerCourier = Readonly<{
  name: string;
  initials: string;
  vehicleLabel: string;
  collectedLabel: string;
  etaLabel: string;
  trackPct: number;
}>;

export type BuyerDispute = Readonly<{
  caseId: string;
  reason: string;
  slaDeadlineAt: number;
  detail?: string;
}>;

export type BuyerRefund = Readonly<{
  toLabel: string;
  sentLabel: string;
  arrivesLabel: string;
}>;

export type BuyerRating = "good" | "late" | "bad";

export type BuyerProblemReason =
  | "neverArrived"
  | "notAsDescribed"
  | "damaged"
  | "missing"
  | "codeEarly";

export type BuyerOrder = Readonly<{
  id: string;
  slug: string;
  productId: string;
  productTitle: string;
  shortLabel: string;
  variant: string;
  qty: number;
  item: Money;
  delivery: Money;
  total: Money;
  status: BuyerOrderStatus;
  deliveryCode: string;
  buyerName: string;
  buyerPhone: string;
  buyerPhoneMasked: string;
  deliveryMode: BuyerDeliveryMode;
  areaId: string;
  areaLabel: string;
  landmark: string;
  paymentMethod: BuyerPaymentMethod;
  payPhone: string;
  paymentLabel: string;
  sellerName: string;
  sellerFirstName: string;
  palette: number;
  beads: number;
  createdAt: number;
  events: readonly BuyerOrderEvent[];
  deliveryWindowTitle: string;
  deliveryWindowNote: string;
  courier?: BuyerCourier;
  dispute?: BuyerDispute;
  refund?: BuyerRefund;
  rating?: BuyerRating;
  codeAcceptedLabel?: string;
  sellerSuspended?: boolean;
}>;

export type ConfirmReceivedInput = Readonly<{
  orderId: string;
  phoneLast4: string;
}>;

export type ConfirmReceivedResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: "not_found" | "invalid" | "wrong_phone" | "bad_status" }>;

export type ReportBuyerProblemInput = Readonly<{
  orderId: string;
  reason: BuyerProblemReason;
}>;

export type ReportBuyerProblemResult =
  | Readonly<{ ok: true; caseId: string }>
  | Readonly<{ ok: false; reason: "not_found" | "bad_status" }>;

export type CancelHeldOrderResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: "not_found" | "bad_status" }>;

export type RateOrderResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: "not_found" | "bad_status" }>;

export type AddDisputeDetailResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: "not_found" | "bad_status" }>;

export type AdvanceOrderResult =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: "not_found" | "bad_status" }>;

export type PlaceBuyerOrderInput = Readonly<{
  sessionId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryMode: BuyerDeliveryMode;
  areaId: string;
  landmark: string;
  paymentMethod: BuyerPaymentMethod;
  payPhone: string;
}>;

export type PlaceBuyerOrderResult =
  | Readonly<{ ok: true; orderId: string; orderPath: string }>
  | Readonly<{
      ok: false;
      reason:
        | "session_expired"
        | "oos"
        | "invalid"
        | "not_found"
        | "rate_limited";
    }>;

export type StartMomoPaymentResult =
  | Readonly<{ ok: true; promptPhone: string }>
  | Readonly<{
      ok: false;
      reason: "session_expired" | "oos" | "invalid" | "not_found" | "rate_limited";
    }>;

export type BuyerCheckoutPage = Readonly<{
  shop: BuyerShop;
  product: BuyerProduct;
  session: BuyerCheckoutSession;
}>;

export type BuyerShopPage = Readonly<{
  shop: BuyerShop;
  catalogue: readonly BuyerCatalogueItem[];
  liveCount: number;
}>;

export type BuyerProductPage = Readonly<{
  shop: BuyerShop;
  product: BuyerProduct;
  catalogue: readonly BuyerCatalogueItem[];
}>;

export type BuyerService = Readonly<{
  getShopBySlug(slug: string): Promise<BuyerShopPage | null>;
  getProduct(slug: string, productId: string): Promise<BuyerProductPage | null>;
  getProductOrGone(
    slug: string,
    productId: string,
  ): Promise<
    | Readonly<{ kind: "product"; page: BuyerProductPage }>
    | Readonly<{ kind: "gone"; shop: BuyerShop; catalogue: readonly BuyerCatalogueItem[] }>
    | null
  >;
  createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult>;
  getCheckoutSession(sessionId: string): Promise<BuyerCheckoutSession | null>;
  getCheckoutPage(
    slug: string,
    sessionId: string,
  ): Promise<BuyerCheckoutPage | null>;
  notifyRestock(input: NotifyRestockInput): Promise<NotifyRestockResult>;
  reportListing(input: ReportListingInput): Promise<ReportListingResult>;
  /** Soft-reserve stock for the MoMo window. */
  startMomoPayment(input: PlaceBuyerOrderInput): Promise<StartMomoPaymentResult>;
  /** Release soft reservation without placing an order. */
  cancelMomoPayment(sessionId: string): Promise<Readonly<{ ok: true }>>;
  /** Commit MoMo (or card) payment → held order. */
  confirmPayment(input: PlaceBuyerOrderInput): Promise<PlaceBuyerOrderResult>;
  /** CoD: place held order without taking money now. */
  placeCodOrder(input: PlaceBuyerOrderInput): Promise<PlaceBuyerOrderResult>;
  getOrder(orderId: string): Promise<BuyerOrder | null>;
  confirmReceived(input: ConfirmReceivedInput): Promise<ConfirmReceivedResult>;
  reportProblem(input: ReportBuyerProblemInput): Promise<ReportBuyerProblemResult>;
  cancelHeldOrder(orderId: string): Promise<CancelHeldOrderResult>;
  rateOrder(orderId: string, rating: BuyerRating): Promise<RateOrderResult>;
  addDisputeDetail(
    orderId: string,
    detail: string,
  ): Promise<AddDisputeDetailResult>;
  /** Demo/QA: move held → transit when courier collects. */
  markCourierCollected(orderId: string): Promise<AdvanceOrderResult>;
}>;
