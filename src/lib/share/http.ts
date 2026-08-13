import { cookies } from "next/headers";
import { getSolaiApiBaseUrl } from "@/lib/api/solai-server";
import type {
  ChecklistId,
  ChecklistState,
  ShareData,
  ShareService,
} from "@/types/share";

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
  const res = await fetch(`${getSolaiApiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Share API ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

export const httpShareService: ShareService = {
  getShareData(draftId) {
    return api<ShareData>(`/v1/share/${draftId}`);
  },
  setChecklistItem(draftId, id: ChecklistId, checked: boolean) {
    return api<ChecklistState>(`/v1/share/${draftId}/checklist`, {
      method: "POST",
      body: JSON.stringify({ id, checked }),
    });
  },
};
