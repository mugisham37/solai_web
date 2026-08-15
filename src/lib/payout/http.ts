import { cookies } from "next/headers";
import { getSolaiApiBaseUrl } from "@/lib/api/solai-server";
import type {
  AccountResult,
  CreateAccountParams,
  HolderInfo,
  NameEnquiryInput,
  PayoutService,
  SendOtpPurpose,
  SendOtpResult,
  SignInResult,
  VerifyOtpResult,
} from "@/types/payout";

const DRAFT_COOKIE = "solai_draft_token";
const SHOP_COOKIE = "solai_shop_session";

async function api<T>(
  path: string,
  init: RequestInit & { withDraftToken?: boolean } = {},
): Promise<T> {
  const { withDraftToken, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);
  headers.set("Content-Type", "application/json");
  if (withDraftToken) {
    const cookieStore = await cookies();
    const token = cookieStore.get(DRAFT_COOKIE)?.value;
    if (token) {
      headers.set("X-Solai-Draft-Token", token);
      headers.set("Cookie", `${DRAFT_COOKIE}=${token}`);
    }
  }
  const res = await fetch(`${getSolaiApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    cache: "no-store",
  });
  if (!res.ok && res.headers.get("content-type")?.includes("application/json")) {
    return (await res.json()) as T;
  }
  if (!res.ok) {
    throw new Error(`Payout API ${path} failed (${res.status})`);
  }

  // Persist shop session cookie from account creation.
  const shopToken = res.headers.get("X-Solai-Shop-Session");
  if (shopToken) {
    const cookieStore = await cookies();
    cookieStore.set(SHOP_COOKIE, shopToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return (await res.json()) as T;
}

export const httpPayoutService: PayoutService = {
  async checkPhoneRegistered(phoneE164) {
    return api(`/v1/payout/phone/${encodeURIComponent(phoneE164)}`);
  },
  async sendOtp(phoneE164, channel, purpose: SendOtpPurpose = "signup") {
    return api<SendOtpResult>("/v1/payout/otp/send", {
      method: "POST",
      body: JSON.stringify({ phoneE164, channel, purpose }),
    });
  },
  async verifyOtp(phoneE164, code) {
    return api<VerifyOtpResult>("/v1/payout/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phoneE164, code }),
    });
  },
  async nameEnquiry(input: NameEnquiryInput) {
    return api<HolderInfo>("/v1/payout/name-enquiry", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async createAccount(params: CreateAccountParams) {
    return api<AccountResult>("/v1/payout/account", {
      method: "POST",
      body: JSON.stringify(params),
      withDraftToken: true,
    });
  },
  async signIn(phoneE164, code) {
    return api<SignInResult>("/v1/payout/session", {
      method: "POST",
      body: JSON.stringify({ phoneE164, code }),
    });
  },
};
