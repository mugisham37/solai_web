import { createSolaiClient, unwrap } from "@/lib/api/solai-server";
import type {
  DashboardService,
  OrderListQuery,
  ReleaseOrderResult,
  SaveProductInput,
  SaveShopSettingsInput,
  ShopPlan,
} from "@/types/dashboard";

const client = () => createSolaiClient("shop");

export const httpDashboardService: DashboardService = {
  async getShop() {
    const res = await client().GET("/v1/dashboard/shop", {});
    return unwrap(res, "getShop");
  },
  async getProducts() {
    const res = await client().GET("/v1/dashboard/products", {});
    return unwrap(res, "getProducts");
  },
  async getProduct(id) {
    const res = await client().GET("/v1/dashboard/products/{product_id}", {
      params: { path: { product_id: id } },
    });
    return unwrap(res, "getProduct");
  },
  async getOrders(query: OrderListQuery = {}) {
    const res = await client().GET("/v1/dashboard/orders", {
      params: {
        query: {
          filter: query.filter,
          q: query.q,
          page: query.page,
          pageSize: query.pageSize,
        },
      },
    });
    return unwrap(res, "getOrders");
  },
  async getOrder(id) {
    const res = await client().GET("/v1/dashboard/orders/{order_id}", {
      params: { path: { order_id: id } },
    });
    return unwrap(res, "getOrder");
  },
  async getPayouts() {
    const res = await client().GET("/v1/dashboard/payouts", {});
    return unwrap(res, "getPayouts");
  },
  async getNotifications() {
    const res = await client().GET("/v1/dashboard/notifications", {});
    return unwrap(res, "getNotifications");
  },
  async getHomeSnapshot() {
    const res = await client().GET("/v1/dashboard/home", {});
    return unwrap(res, "getHomeSnapshot");
  },
  async getMoneySnapshot() {
    const res = await client().GET("/v1/dashboard/money", {});
    return unwrap(res, "getMoneySnapshot");
  },
  async getNeedsYouCount() {
    const res = await client().GET("/v1/dashboard/needs-you-count", {});
    const data = await unwrap<{ count: number }>(res, "getNeedsYouCount");
    return data.count;
  },
  async search(query) {
    const res = await client().GET("/v1/dashboard/search", {
      params: { query: { q: query } },
    });
    return unwrap(res, "search");
  },
  async releaseOrder(orderId, code, opts) {
    const res = await client().POST("/v1/dashboard/orders/{order_id}/release", {
      params: { path: { order_id: orderId } },
      body: { code },
      headers: opts?.ip ? { "X-Forwarded-For": opts.ip } : undefined,
    });
    return unwrap<ReleaseOrderResult>(res, "releaseOrder");
  },
  async reportOrderProblem(orderId, reason) {
    const res = await client().POST("/v1/dashboard/orders/{order_id}/problem", {
      params: { path: { order_id: orderId } },
      body: { reason },
    });
    return unwrap(res, "reportOrderProblem");
  },
  async saveProduct(input: SaveProductInput) {
    const res = await client().PUT("/v1/dashboard/products", { body: input });
    return unwrap(res, "saveProduct");
  },
  async deleteProduct(id) {
    const res = await client().DELETE("/v1/dashboard/products/{product_id}", {
      params: { path: { product_id: id } },
    });
    return unwrap(res, "deleteProduct");
  },
  async saveShopSettings(input: SaveShopSettingsInput) {
    const res = await client().PUT("/v1/dashboard/settings", { body: input });
    return unwrap(res, "saveShopSettings");
  },
  async switchPlan(plan: ShopPlan) {
    const res = await client().POST("/v1/dashboard/plan", { body: { plan } });
    return unwrap(res, "switchPlan");
  },
  async startBoost(input) {
    const res = await client().POST("/v1/dashboard/boost", { body: input });
    return unwrap(res, "startBoost");
  },
};
