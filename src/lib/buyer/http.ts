import { createSolaiClient, unwrap } from "@/lib/api/solai-server";
import type {
  AddDisputeDetailResult,
  AdvanceOrderResult,
  BuyerCheckoutPage,
  BuyerCheckoutSession,
  BuyerOrder,
  BuyerRating,
  BuyerService,
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

// Buyer flows are anonymous — identity lives in the checkout session id in
// the URL/body, not a cookie — so this is the one domain with auth "none".
const client = () => createSolaiClient("none");

export const httpBuyerService: BuyerService = {
  async getShopBySlug(slug) {
    const res = await client().GET("/v1/buyer/shops/{slug}", { params: { path: { slug } } });
    return unwrap(res, "getShopBySlug");
  },
  async getProduct(slug, productId) {
    const res = await client().GET("/v1/buyer/shops/{slug}/products/{product_id}", {
      params: { path: { slug, product_id: productId } },
    });
    return unwrap(res, "getProduct");
  },
  async getProductOrGone(slug, productId) {
    const res = await client().GET(
      "/v1/buyer/shops/{slug}/products/{product_id}/or-gone",
      { params: { path: { slug, product_id: productId } } },
    );
    return unwrap(res, "getProductOrGone");
  },
  async createCheckoutSession(input: CreateCheckoutSessionInput) {
    const res = await client().POST("/v1/buyer/checkout-sessions", { body: input });
    return unwrap<CreateCheckoutSessionResult>(res, "createCheckoutSession");
  },
  async getCheckoutSession(sessionId) {
    const res = await client().GET("/v1/buyer/checkout-sessions/{session_id}", {
      params: { path: { session_id: sessionId } },
    });
    return unwrap<BuyerCheckoutSession | null>(res, "getCheckoutSession");
  },
  async getCheckoutPage(slug, sessionId) {
    const res = await client().GET("/v1/buyer/shops/{slug}/checkout/{session_id}", {
      params: { path: { slug, session_id: sessionId } },
    });
    return unwrap<BuyerCheckoutPage | null>(res, "getCheckoutPage");
  },
  async notifyRestock(input: NotifyRestockInput) {
    const res = await client().POST("/v1/buyer/notify-restock", { body: input });
    return unwrap<NotifyRestockResult>(res, "notifyRestock");
  },
  async reportListing(input: ReportListingInput) {
    const res = await client().POST("/v1/buyer/report-listing", { body: input });
    return unwrap<ReportListingResult>(res, "reportListing");
  },
  async startMomoPayment(input: PlaceBuyerOrderInput) {
    const res = await client().POST("/v1/buyer/payments/momo/start", { body: input });
    return unwrap<StartMomoPaymentResult>(res, "startMomoPayment");
  },
  async cancelMomoPayment(sessionId) {
    const res = await client().POST("/v1/buyer/payments/momo/cancel/{session_id}", {
      params: { path: { session_id: sessionId } },
    });
    return unwrap<{ ok: true }>(res, "cancelMomoPayment");
  },
  async confirmPayment(input: PlaceBuyerOrderInput) {
    const res = await client().POST("/v1/buyer/payments/confirm", { body: input });
    return unwrap<PlaceBuyerOrderResult>(res, "confirmPayment");
  },
  async placeCodOrder(input: PlaceBuyerOrderInput) {
    const res = await client().POST("/v1/buyer/orders/cod", { body: input });
    return unwrap<PlaceBuyerOrderResult>(res, "placeCodOrder");
  },
  async getOrder(orderId) {
    const res = await client().GET("/v1/buyer/orders/{order_id}", {
      params: { path: { order_id: orderId } },
    });
    return unwrap<BuyerOrder | null>(res, "getOrder");
  },
  async confirmReceived(input: ConfirmReceivedInput) {
    const res = await client().POST("/v1/buyer/orders/confirm-received", { body: input });
    return unwrap<ConfirmReceivedResult>(res, "confirmReceived");
  },
  async reportProblem(input: ReportBuyerProblemInput) {
    const res = await client().POST("/v1/buyer/orders/report-problem", { body: input });
    return unwrap<ReportBuyerProblemResult>(res, "reportProblem");
  },
  async cancelHeldOrder(orderId) {
    const res = await client().POST("/v1/buyer/orders/{order_id}/cancel", {
      params: { path: { order_id: orderId } },
    });
    return unwrap<CancelHeldOrderResult>(res, "cancelHeldOrder");
  },
  async rateOrder(orderId, rating: BuyerRating) {
    const res = await client().POST("/v1/buyer/orders/{order_id}/rate", {
      params: { path: { order_id: orderId } },
      body: { rating },
    });
    return unwrap<RateOrderResult>(res, "rateOrder");
  },
  async addDisputeDetail(orderId, detail) {
    const res = await client().POST("/v1/buyer/orders/{order_id}/dispute-detail", {
      params: { path: { order_id: orderId } },
      body: { detail },
    });
    return unwrap<AddDisputeDetailResult>(res, "addDisputeDetail");
  },
  async markCourierCollected(orderId) {
    const res = await client().POST("/v1/buyer/orders/{order_id}/courier-collected", {
      params: { path: { order_id: orderId } },
    });
    return unwrap<AdvanceOrderResult>(res, "markCourierCollected");
  },
};
