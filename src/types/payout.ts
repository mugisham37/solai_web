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

/** Everything here comes from the API — never invent a count or a join date. */
export type ExistingShopSummary = Readonly<{
  shopName: string;
  productCount: number;
  /** ISO 8601; the screen formats it for the active locale. */
  joinedAt: string;
}>;

export type CheckPhoneResult = Readonly<{
  registered: boolean;
  shopName?: string;
  productCount?: number;
  joinedAt?: string;
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
      /** "signin" reuses this same screen for a returning seller resuming
       * an existing shop session instead of creating a new one. */
      mode?: "signup" | "signin";
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
      /** Carried through so a retry re-binds the name the rail actually
       * returned, rather than a placeholder. */
      holderName?: string;
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
  | { ok: true; resendAfterSeconds: number }
  | {
      ok: false;
      code: "rate_limited" | "in_use" | "unsupported" | "error" | "not_found";
      message?: string;
    };

export type VerifyOtpResult =
  | { ok: true }
  | {
      ok: false;
      code: "invalid" | "locked" | "expired" | "rate_limited";
      attemptsRemaining?: number;
      lockoutUntil?: string;
    };

export type SignInResult =
  | { ok: true; shopSlug: string; accountId: string; sessionToken: string }
  | {
      ok: false;
      code: "invalid" | "locked" | "expired" | "rate_limited" | "not_found";
      message?: string;
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

export type SendOtpPurpose = "signup" | "signin";

export type PayoutService = Readonly<{
  checkPhoneRegistered(phoneE164: string): Promise<CheckPhoneResult>;
  sendOtp(
    phoneE164: string,
    channel: "sms" | "voice",
    purpose?: SendOtpPurpose,
  ): Promise<SendOtpResult>;
  verifyOtp(phoneE164: string, code: string): Promise<VerifyOtpResult>;
  nameEnquiry(input: NameEnquiryInput): Promise<HolderInfo>;
  createAccount(params: CreateAccountParams): Promise<AccountResult>;
  signIn(phoneE164: string, code: string): Promise<SignInResult>;
}>;
