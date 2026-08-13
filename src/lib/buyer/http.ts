import { getSolaiApiBaseUrl } from "@/lib/api/solai-server";
import type {
  AddDisputeDetailResult,
  AdvanceOrderResult,
  BuyerCheckoutPage,
  BuyerCheckoutSession,
  BuyerOrder,
  BuyerProductPage,
  BuyerRating,
  BuyerService,
  BuyerShopPage,
  CancelHeldOrderResult,
  ConfirmReceivedInput,
  ConfirmReceivedResult,
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  NotifyRestockInput,
  NotifyRestockResult,
  PlaceBuyerOrderInput,
  PlaceBuyerOrderResult,
  RateOrderResult,
  ReportBuyerProblemInput,
  ReportBuyerProblemResult,
  ReportListingInput,
  ReportListingResult,
  StartMomoPaymentResult,
} from "@/types/buyer";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getSolaiApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Buyer API ${path} failed (${res.status}): ${text}`);
  }
  if (res.status === 204) return null as T;
  const text = await res.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

export const httpBuyerService: BuyerService = {
  getShopBySlug: (slug) => api(`/v1/buyer/shops/${encodeURIComponent(slug)}`),
  getProduct: (slug, productId) =>
    api(
      `/v1/buyer/shops/${encodeURIComponent(slug)}/products/${encodeURIComponent(productId)}`,
    ),
  getProductOrGone: (slug, productId) =>
    api(
      `/v1/buyer/shops/${encodeURIComponent(slug)}/products/${encodeURIComponent(productId)}/or-gone`,
    ),
  createCheckoutSession: (input: CreateCheckoutSessionInput) =>
    api<CreateCheckoutSessionResult>("/v1/buyer/checkout-sessions", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getCheckoutSession: (sessionId) =>
    api<BuyerCheckoutSession | null>(
      `/v1/buyer/checkout-sessions/${encodeURIComponent(sessionId)}`,
    ),
  getCheckoutPage: (slug, sessionId) =>
    api<BuyerCheckoutPage | null>(
      `/v1/buyer/shops/${encodeURIComponent(slug)}/checkout/${encodeURIComponent(sessionId)}`,
    ),
  notifyRestock: (input: NotifyRestockInput) =>
    api<NotifyRestockResult>("/v1/buyer/notify-restock", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  reportListing: (input: ReportListingInput) =>
    api<ReportListingResult>("/v1/buyer/report-listing", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  startMomoPayment: (input: PlaceBuyerOrderInput) =>
    api<StartMomoPaymentResult>("/v1/buyer/payments/momo/start", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  cancelMomoPayment: (sessionId) =>
    api<{ ok: true }>(
      `/v1/buyer/payments/momo/cancel/${encodeURIComponent(sessionId)}`,
      { method: "POST" },
    ),
  confirmPayment: (input: PlaceBuyerOrderInput) =>
    api<PlaceBuyerOrderResult>("/v1/buyer/payments/confirm", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  placeCodOrder: (input: PlaceBuyerOrderInput) =>
    api<PlaceBuyerOrderResult>("/v1/buyer/orders/cod", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getOrder: (orderId) =>
    api<BuyerOrder | null>(`/v1/buyer/orders/${encodeURIComponent(orderId)}`),
  confirmReceived: (input: ConfirmReceivedInput) =>
    api<ConfirmReceivedResult>("/v1/buyer/orders/confirm-received", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  reportProblem: (input: ReportBuyerProblemInput) =>
    api<ReportBuyerProblemResult>("/v1/buyer/orders/report-problem", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  cancelHeldOrder: (orderId) =>
    api<CancelHeldOrderResult>(
      `/v1/buyer/orders/${encodeURIComponent(orderId)}/cancel`,
      { method: "POST" },
    ),
  rateOrder: (orderId, rating: BuyerRating) =>
    api<RateOrderResult>(`/v1/buyer/orders/${encodeURIComponent(orderId)}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    }),
  addDisputeDetail: (orderId, detail) =>
    api<AddDisputeDetailResult>(
      `/v1/buyer/orders/${encodeURIComponent(orderId)}/dispute-detail`,
      {
        method: "POST",
        body: JSON.stringify({ detail }),
      },
    ),
  markCourierCollected: (orderId) =>
    api<AdvanceOrderResult>(
      `/v1/buyer/orders/${encodeURIComponent(orderId)}/courier-collected`,
      { method: "POST" },
    ),
};
