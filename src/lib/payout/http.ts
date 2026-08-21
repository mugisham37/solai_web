import { createSolaiClient, unwrap, unwrapResult } from "@/lib/api/solai-server";
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

// Most payout calls need no identity yet (the phone number itself is the
// subject); createAccount needs the draft token to prove ownership of the
// draft being migrated, and mints a shop session that must be written back
// to a cookie for the browser's next request.
const anon = () => createSolaiClient("none");
const minting = () => createSolaiClient("draft", { persistShopSession: true });

export const httpPayoutService: PayoutService = {
  async checkPhoneRegistered(phoneE164) {
    const res = await anon().GET("/v1/payout/phone/{phone_e164}", {
      params: { path: { phone_e164: phoneE164 } },
    });
    return unwrap(res, "checkPhoneRegistered");
  },
  async sendOtp(phoneE164, channel, purpose: SendOtpPurpose = "signup") {
    const res = await anon().POST("/v1/payout/otp/send", {
      body: { phoneE164, channel, purpose },
    });
    return unwrapResult<SendOtpResult>(res, "sendOtp");
  },
  async verifyOtp(phoneE164, code) {
    const res = await anon().POST("/v1/payout/otp/verify", { body: { phoneE164, code } });
    return unwrapResult<VerifyOtpResult>(res, "verifyOtp");
  },
  async nameEnquiry(input: NameEnquiryInput) {
    const res = await anon().POST("/v1/payout/name-enquiry", { body: input });
    return unwrap<HolderInfo>(res, "nameEnquiry");
  },
  async createAccount(params: CreateAccountParams) {
    // Draft-token ownership check happens here, so this is the one call
    // that actually needs "draft" auth mode; signIn doesn't (it resumes an
    // existing shop by phone, no draft involved).
    const res = await minting().POST("/v1/payout/account", { body: params });
    return unwrapResult<AccountResult>(res, "createAccount");
  },
  async signIn(phoneE164, code) {
    // Resumes an existing shop by phone — no draft involved, unlike
    // createAccount — but still mints (and must persist) a shop session.
    const client = createSolaiClient("none", { persistShopSession: true });
    const res = await client.POST("/v1/payout/session", { body: { phoneE164, code } });
    return unwrapResult<SignInResult>(res, "signIn");
  },
};
