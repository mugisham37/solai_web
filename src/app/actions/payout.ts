"use server";

import { headers } from "next/headers";
import { getPayoutService } from "@/lib/payout";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import type {
  AccountResult,
  CreateAccountParams,
  NameEnquiryInput,
  SendOtpPurpose,
  SendOtpResult,
  SignInResult,
  VerifyOtpResult,
} from "@/types/payout";
import type { HolderInfo } from "@/types/payout";

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function requestPayoutOtp(
  phoneE164: string,
  channel: "sms" | "voice" = "sms",
  purpose: SendOtpPurpose = "signup",
): Promise<SendOtpResult> {
  const ip = await clientIp();
  const phoneLimit = checkRateLimit({
    key: `otp-send:phone:${phoneE164}`,
    ...RATE_LIMITS.otpSendPerPhone,
  });
  if (!phoneLimit.allowed) {
    return { ok: false, code: "rate_limited", message: "Too many codes sent. Try again later." };
  }
  const ipLimit = checkRateLimit({
    key: `otp-send:ip:${ip}`,
    ...RATE_LIMITS.otpSendPerIp,
  });
  if (!ipLimit.allowed) {
    return { ok: false, code: "rate_limited", message: "Too many requests." };
  }
  return getPayoutService().sendOtp(phoneE164, channel, purpose);
}

export async function verifyPayoutOtp(phoneE164: string, code: string): Promise<VerifyOtpResult> {
  const ip = await clientIp();
  const limit = checkRateLimit({
    key: `otp-verify:phone:${phoneE164}:${ip}`,
    ...RATE_LIMITS.otpVerifyPerPhone,
  });
  if (!limit.allowed) {
    return { ok: false, code: "rate_limited" };
  }
  return getPayoutService().verifyOtp(phoneE164, code);
}

export async function payoutNameEnquiry(input: NameEnquiryInput): Promise<HolderInfo> {
  return getPayoutService().nameEnquiry(input);
}

export async function checkSellerPhone(phoneE164: string) {
  return getPayoutService().checkPhoneRegistered(phoneE164);
}

export async function createSellerAccount(params: CreateAccountParams): Promise<AccountResult> {
  return getPayoutService().createAccount(params);
}

export async function signInSeller(phoneE164: string, code: string): Promise<SignInResult> {
  const ip = await clientIp();
  const limit = checkRateLimit({
    key: `otp-verify:phone:${phoneE164}:${ip}`,
    ...RATE_LIMITS.otpVerifyPerPhone,
  });
  if (!limit.allowed) {
    return { ok: false, code: "rate_limited" };
  }
  return getPayoutService().signIn(phoneE164, code);
}
