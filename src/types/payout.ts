import type { CountryCode } from "@/data/countries";
import type { Draft } from "@/types/build";
import type { CurrencyCode } from "@/types/money";

export type PayoutScreenState =
  | "form"
  | "confirm"
  | "verify"
  | "working"
  | "done"
  | "locked"
  | "inuse"
  | "unsupported"
  | "error";

export type DestinationKind = "wallet" | "airtel" | "bank";

export type WalletMode = "same" | "other";

export type PayoutRail = "mtn-momo" | "airtel-money" | "mpesa" | "bank";

export type StoredPayoutDestination = Readonly<{
  rail: PayoutRail;
  maskedIdentifier: string;
  verifiedHolderName: string;
  verifiedAt: string;
  bankId?: string;
  bankName?: string;
}>;

export type HolderInfo = Readonly<{
  holderName: string;
  maskedDestination: string;
  railLabel: string;
}>;

export type PayoutFormSnapshot = Readonly<{
  countryCode: CountryCode;
  phoneE164: string;
  phoneDisplay: string;
  detectedNetworkId: string | null;
  destinationKind: DestinationKind;
  walletMode: WalletMode;
  walletPhoneE164?: string;
  airtelPhoneE164?: string;
  bankId?: string;
  bankName?: string;
  accountNumber?: string;
  shopName: string;
  consent: boolean;
}>;

export type ExistingShopSummary = Readonly<{
  shopName: string;
  productCount: number;
  joinedLabel: string;
}>;

export type PayoutDoneSummary = Readonly<{
  destination: StoredPayoutDestination;
  shopName: string;
  shopSlug: string;
  productReadyLabel: string;
}>;

export type PayoutState =
  | { state: "form"; form?: PayoutFormSnapshot }
  | {
      state: "confirm";
      form: PayoutFormSnapshot;
      holder: HolderInfo;
    }
  | {
      state: "verify";
      form: PayoutFormSnapshot;
      holder?: HolderInfo;
      otpAttempts: number;
      lockoutUntil?: string;
    }
  | {
      state: "working";
      form: PayoutFormSnapshot;
      phase: "verify" | "link" | "migrate";
    }
  | {
      state: "done";
      summary: PayoutDoneSummary;
    }
  | {
      state: "locked";
      form: PayoutFormSnapshot;
      lockoutUntil: string;
    }
  | {
      state: "inuse";
      form: PayoutFormSnapshot;
      existingShop: ExistingShopSummary;
    }
  | {
      state: "unsupported";
      form: PayoutFormSnapshot;
      networkName: string;
    }
  | {
      state: "error";
      form: PayoutFormSnapshot;
      message: string;
      retryTarget: "verify" | "working" | "form";
    };

export type BankOption = Readonly<{
  id: string;
  name: string;
  countryCode: CountryCode;
}>;

export type CreateAccountParams = Readonly<{
  draftId: string;
  phoneE164: string;
  shopName: string;
  destination: StoredPayoutDestination;
  consentVersion: string;
  idempotencyKey: string;
}>;

export type AccountResult =
  | {
      ok: true;
      shopSlug: string;
      accountId: string;
      migratedDraft: Draft;
    }
  | { ok: false; code: "partial" | "conflict" | "unknown"; message: string };

export type SendOtpResult =
  | { ok: true }
  | { ok: false; code: "rate_limited" | "in_use" | "unsupported" | "error"; message?: string };

export type VerifyOtpResult =
  | { ok: true }
  | {
      ok: false;
      code: "invalid" | "locked" | "expired" | "rate_limited";
      attemptsRemaining?: number;
      lockoutUntil?: string;
    };

export type NameEnquiryInput = Readonly<{
  countryCode: CountryCode;
  currency: CurrencyCode;
  destinationKind: DestinationKind;
  walletMode: WalletMode;
  phoneE164: string;
  walletPhoneE164?: string;
  airtelPhoneE164?: string;
  bankId?: string;
  accountNumber?: string;
  detectedNetworkId: string | null;
}>;

export const PAYOUT_TERMS_VERSION = "2026-08-01";

export const OTP_MAX_ATTEMPTS = 5;
export const OTP_LOCKOUT_MINUTES = 15;
export const OTP_RESEND_SECONDS = 30;

export type PayoutService = Readonly<{
  checkPhoneRegistered(phoneE164: string): Promise<{ registered: boolean; shopName?: string }>;
  sendOtp(phoneE164: string, channel: "sms" | "voice"): Promise<SendOtpResult>;
  verifyOtp(phoneE164: string, code: string): Promise<VerifyOtpResult>;
  nameEnquiry(input: NameEnquiryInput): Promise<HolderInfo>;
  createAccount(params: CreateAccountParams): Promise<AccountResult>;
}>;
