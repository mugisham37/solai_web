import { cookies } from "next/headers";
import { getSolaiApiBaseUrl } from "@/lib/api/solai-server";
import type {
  DashboardService,
  OrderListQuery,
  ReleaseOrderResult,
  SaveProductInput,
  SaveShopSettingsInput,
  ShopPlan,
} from "@/types/dashboard";

const SHOP_COOKIE = "solai_shop_session";

async function shopHeaders(): Promise<Headers> {
  const headers = new Headers({ "Content-Type": "application/json" });
  const cookieStore = await cookies();
  const token = cookieStore.get(SHOP_COOKIE)?.value;
  if (token) {
    headers.set("X-Solai-Shop-Session", token);
    headers.set("Cookie", `${SHOP_COOKIE}=${token}`);
  }
  return headers;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = await shopHeaders();
  const res = await fetch(`${getSolaiApiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dashboard API ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

export const httpDashboardService: DashboardService = {
  getShop: () => api("/v1/dashboard/shop"),
  getProducts: () => api("/v1/dashboard/products"),
  getProduct: (id) => api(`/v1/dashboard/products/${id}`),
  getOrders: (query: OrderListQuery = {}) => {
    const params = new URLSearchParams();
    if (query.filter) params.set("filter", query.filter);
    if (query.q) params.set("q", query.q);
    if (query.page) params.set("page", String(query.page));
    if (query.pageSize) params.set("pageSize", String(query.pageSize));
    const qs = params.toString();
    return api(`/v1/dashboard/orders${qs ? `?${qs}` : ""}`);
  },
  getOrder: (id) => api(`/v1/dashboard/orders/${id}`),
  getPayouts: () => api("/v1/dashboard/payouts"),
  getNotifications: () => api("/v1/dashboard/notifications"),
  getHomeSnapshot: () => api("/v1/dashboard/home"),
  getMoneySnapshot: () => api("/v1/dashboard/money"),
  async getNeedsYouCount() {
    const data = await api<{ count: number }>("/v1/dashboard/needs-you-count");
    return data.count;
  },
  search: (query) =>
    api(`/v1/dashboard/search?q=${encodeURIComponent(query)}`),
  releaseOrder: (orderId, code, opts) =>
    api<ReleaseOrderResult>(`/v1/dashboard/orders/${orderId}/release`, {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: opts?.ip ? { "X-Forwarded-For": opts.ip } : undefined,
    }),
  reportOrderProblem: (orderId, reason) =>
    api(`/v1/dashboard/orders/${orderId}/problem`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  saveProduct: (input: SaveProductInput) =>
    api("/v1/dashboard/products", {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deleteProduct: (id) =>
    api(`/v1/dashboard/products/${id}`, { method: "DELETE" }),
  saveShopSettings: (input: SaveShopSettingsInput) =>
    api("/v1/dashboard/settings", {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  switchPlan: (plan: ShopPlan) =>
    api("/v1/dashboard/plan", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),
  startBoost: (input) =>
    api("/v1/dashboard/boost", {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
