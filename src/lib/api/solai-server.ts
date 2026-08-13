/**
 * Server-only SolAI API client helpers.
 * Used by Next.js route handlers / server actions to talk to solai_server.
 */

const DEFAULT_API_URL = "http://127.0.0.1:8000";

export function getSolaiApiBaseUrl(): string {
  return (
    process.env.SOLAI_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SOLAI_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_URL
  );
}

export type CreateDraftApiResult = {
  draftId: string;
  draftToken: string;
};

export async function createDraftOnServer(hint?: string): Promise<CreateDraftApiResult> {
  const qs = hint?.trim() ? `?hint=${encodeURIComponent(hint.trim())}` : "";
  const res = await fetch(`${getSolaiApiBaseUrl()}/v1/draft${qs}`, {
    method: "POST",
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create draft (${res.status}): ${body}`);
  }
  const data = (await res.json()) as { draftId: string };
  const draftToken =
    res.headers.get("X-Solai-Draft-Token") ||
    parseSetCookieToken(res.headers.get("set-cookie"));
  if (!data.draftId || !draftToken) {
    throw new Error("Draft create response missing draftId or session token");
  }
  return { draftId: data.draftId, draftToken };
}

function parseSetCookieToken(setCookie: string | null): string {
  if (!setCookie) return "";
  const match = /solai_draft_token=([^;]+)/.exec(setCookie);
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

export async function proxyDraftRequest(
  path: string,
  init: RequestInit & { draftToken?: string } = {},
): Promise<Response> {
  const { draftToken, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);
  if (draftToken) {
    headers.set("X-Solai-Draft-Token", draftToken);
    headers.set("Cookie", `solai_draft_token=${draftToken}`);
  }
  return fetch(`${getSolaiApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    cache: "no-store",
  });
}
