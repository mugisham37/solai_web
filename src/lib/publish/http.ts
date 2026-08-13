import { cookies } from "next/headers";
import { getSolaiApiBaseUrl } from "@/lib/api/solai-server";
import type {
  PublishService,
  PublishStatus,
  SlugChangeResult,
  SlugCheckResult,
} from "@/types/live";

const DRAFT_COOKIE = "solai_draft_token";

async function withDraftToken(): Promise<Headers> {
  const headers = new Headers({ "Content-Type": "application/json" });
  const cookieStore = await cookies();
  const token = cookieStore.get(DRAFT_COOKIE)?.value;
  if (token) {
    headers.set("X-Solai-Draft-Token", token);
    headers.set("Cookie", `${DRAFT_COOKIE}=${token}`);
  }
  return headers;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = await withDraftToken();
  if (init?.headers) {
    new Headers(init.headers).forEach((v, k) => headers.set(k, v));
  }
  const res = await fetch(`${getSolaiApiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Publish API ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

export const httpPublishService: PublishService = {
  startPublish(draftId) {
    return api<PublishStatus>(`/v1/publish/${draftId}/start`, { method: "POST" });
  },
  getPublishStatus(draftId) {
    return api<PublishStatus>(`/v1/publish/${draftId}/status`);
  },
  checkSlug(draftId, slug) {
    return api<SlugCheckResult>(
      `/v1/publish/${draftId}/slug?slug=${encodeURIComponent(slug)}`,
    );
  },
  changeSlug(draftId, nextSlug) {
    return api<SlugChangeResult>(`/v1/publish/${draftId}/slug`, {
      method: "POST",
      body: JSON.stringify({ slug: nextSlug }),
    });
  },
  async resolveSlug(slug) {
    const data = await api<{ slug: string | null }>(
      `/v1/publish/resolve/${encodeURIComponent(slug)}`,
    );
    return data.slug;
  },
};
