/**
 * Server-only SolAI API client helpers.
 * Used by Next.js route handlers / server actions to talk to solai_server.
 */

import { cookies } from "next/headers";
import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "@/lib/api/generated-types";

const DEFAULT_API_URL = "http://127.0.0.1:8000";

export function getSolaiApiBaseUrl(): string {
  return (
    process.env.SOLAI_API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SOLAI_API_URL?.replace(/\/$/, "") ||
    DEFAULT_API_URL
  );
}

const DRAFT_COOKIE = "solai_draft_token";
const SHOP_COOKIE = "solai_shop_session";
const DRAFT_TOKEN_HEADER = "X-Solai-Draft-Token";
const SHOP_SESSION_HEADER = "X-Solai-Shop-Session";

/** Which identity — if any — a call needs, matching the shape every
 * domain's hand-rolled `api()` helper implemented ad hoc before this
 * client existed. "none" for buyer (anonymous, session-id-in-URL);
 * "draft" for the seller-onboarding domains (publish, share, and payout's
 * account/session-minting calls); "shop" once a shop session exists
 * (dashboard, and most of payout). */
export type SolaiAuthMode = "none" | "draft" | "shop";

async function authHeaders(mode: SolaiAuthMode): Promise<Record<string, string>> {
  if (mode === "none") return {};
  const cookieName = mode === "draft" ? DRAFT_COOKIE : SHOP_COOKIE;
  const headerName = mode === "draft" ? DRAFT_TOKEN_HEADER : SHOP_SESSION_HEADER;
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return {};
  return { [headerName]: token, Cookie: `${cookieName}=${token}` };
}

/** Writes back a freshly minted shop session (create_account / sign-in) so
 * the browser's next request already carries it — every domain used to
 * duplicate this exact cookie-set call inline in its own `api()` helper. */
async function persistShopSessionFromResponse(response: Response): Promise<void> {
  const token = response.headers.get(SHOP_SESSION_HEADER);
  if (!token) return;
  const cookieStore = await cookies();
  cookieStore.set(SHOP_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

/**
 * A typed client for solai_server, generated from its own OpenAPI schema
 * (`npm run generate:api` regenerates src/lib/api/generated-types.ts from
 * the live /openapi.json — commit the regenerated file, don't hand-edit
 * it). Server-only: reads `next/headers` cookies via middleware, so it
 * must only be constructed inside a server action or route handler, never
 * imported into a client component.
 *
 * `persistShopSession: true` is for the two calls that actually mint a
 * session (payout's createAccount and signIn) — every other caller should
 * leave it off.
 */
export function createSolaiClient(
  auth: SolaiAuthMode = "none",
  { persistShopSession = false }: { persistShopSession?: boolean } = {},
) {
  const client = createClient<paths>({
    baseUrl: getSolaiApiBaseUrl(),
    cache: "no-store",
  });

  const middleware: Middleware = {
    async onRequest({ request }) {
      const headers = await authHeaders(auth);
      for (const [key, value] of Object.entries(headers)) {
        request.headers.set(key, value);
      }
      return request;
    },
    async onResponse({ response }) {
      if (persistShopSession) {
        await persistShopSessionFromResponse(response);
      }
      return response;
    },
  };
  client.use(middleware);
  return client;
}

/**
 * Every domain's typed calls used to throw a hand-formatted Error on a
 * non-2xx response — callers across the app already expect that contract
 * (a rejected promise), not openapi-fetch's default `{data, error}` return
 * shape. This preserves it in one place instead of six.
 */
export async function unwrap<T>(
  result: { data?: unknown; error?: unknown; response: Response },
  label: string,
): Promise<T> {
  if (result.error !== undefined) {
    const body =
      typeof result.error === "string" ? result.error : JSON.stringify(result.error);
    throw new Error(`${label} failed (${result.response.status}): ${body}`);
  }
  return result.data as T;
}

/**
 * For endpoints whose result is itself a discriminated `{ok: true | false,
 * ...}` union (payout's send/verify/account/session calls) — a wrong OTP or
 * an already-registered phone is an expected outcome the caller checks via
 * `.ok`, not an exception, and the backend returns 200 for those. This
 * still throws for a response that doesn't even look like the expected
 * shape (a genuine 500 or a network failure), rather than handing the
 * caller a fail-shaped object it never actually got.
 */
export async function unwrapResult<T extends { ok: boolean }>(
  result: { data?: unknown; error?: unknown; response: Response },
  label: string,
): Promise<T> {
  const body = result.error !== undefined ? result.error : result.data;
  if (body && typeof body === "object" && "ok" in body) {
    return body as T;
  }
  throw new Error(`${label} failed (${result.response.status}): ${JSON.stringify(body)}`);
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
