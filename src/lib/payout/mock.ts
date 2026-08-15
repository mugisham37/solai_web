import { createHash, randomBytes } from "crypto";
import { getDraftMemory, saveDraftMemory } from "@/lib/draft-store";
import { getBankById } from "@/lib/payout/banks";
import { maskPhoneE164, toE164 } from "@/lib/phone/format";
import { getCountryByCode } from "@/data/countries";
import type {
  AccountResult,
  HolderInfo,
  NameEnquiryInput,
  PayoutService,
  SendOtpResult,
  VerifyOtpResult,
} from "@/types/payout";
import { OTP_LOCKOUT_MINUTES, OTP_MAX_ATTEMPTS } from "@/types/payout";

const MOCK_VALID_CODE = "508312";
type RegisteredShop = { shopName: string; productCount: number; joinedAt: string };

const registeredPhones = new Map<string, RegisteredShop>();

type OtpRecord = {
  hash: string;
  expiresAt: number;
  attempts: number;
  lockoutUntil?: number;
};

const otpStore = new Map<string, OtpRecord>();
const idempotency = new Map<string, AccountResult>();

function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

function resolveDestinationLabel(input: NameEnquiryInput): { label: string; masked: string; name: string } {
  if (input.destinationKind === "bank") {
    const bank = getBankById(input.bankId ?? "");
    const acct = input.accountNumber ?? "";
    const masked = acct.length > 4 ? `••••${acct.slice(-4)}` : acct;
    return {
      label: bank?.name ?? "Bank account",
      masked: `${bank?.name ?? "Bank"} · ${masked}`,
      name: "U. AMARA",
    };
  }
  let e164 = input.phoneE164;
  if (input.destinationKind === "airtel" && input.airtelPhoneE164) {
    e164 = input.airtelPhoneE164;
  }
  if (input.destinationKind === "wallet" && input.walletMode === "other" && input.walletPhoneE164) {
    e164 = input.walletPhoneE164;
  }
  const net =
    input.detectedNetworkId === "airtel"
      ? "Airtel Money"
      : input.detectedNetworkId === "mpesa"
        ? "M-Pesa"
        : "MTN Mobile Money";
  return {
    label: input.destinationKind === "airtel" ? "Airtel Money" : net,
    masked: `${input.destinationKind === "airtel" ? "Airtel Money" : net} · ${maskPhoneE164(e164)}`,
    name: "U. AMARA",
  };
}

export const mockPayoutService: PayoutService = {
  async checkPhoneRegistered(phoneE164) {
    const hit = registeredPhones.get(phoneE164);
    if (hit) {
      return {
        registered: true,
        shopName: hit.shopName,
        productCount: hit.productCount,
        joinedAt: hit.joinedAt,
      };
    }
    return { registered: false };
  },

  async sendOtp(phoneE164, channel: "sms" | "voice"): Promise<SendOtpResult> {
    void channel;
    if (phoneE164.endsWith("9999")) {
      return { ok: false, code: "unsupported", message: "Network not supported for payout" };
    }
    const existing = registeredPhones.get(phoneE164);
    if (existing && phoneE164.endsWith("8888")) {
      return { ok: false, code: "in_use", message: existing.shopName };
    }
    const code = randomBytes(3).toString("hex").slice(0, 6).replace(/\D/g, "").padEnd(6, "0").slice(0, 6);
    const useCode = process.env.NODE_ENV === "development" ? MOCK_VALID_CODE : code;
    otpStore.set(phoneE164, {
      hash: hashOtp(useCode),
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });
    return { ok: true };
  },

  async verifyOtp(phoneE164, code): Promise<VerifyOtpResult> {
    const rec = otpStore.get(phoneE164);
    const fail = (): VerifyOtpResult => ({
      ok: false,
      code: "invalid",
      attemptsRemaining: rec ? Math.max(0, OTP_MAX_ATTEMPTS - rec.attempts) : 0,
    });
    if (!rec || Date.now() > rec.expiresAt) {
      return { ok: false, code: "expired" };
    }
    if (rec.lockoutUntil && Date.now() < rec.lockoutUntil) {
      return { ok: false, code: "locked", lockoutUntil: new Date(rec.lockoutUntil).toISOString() };
    }
    if (rec.hash !== hashOtp(code)) {
      rec.attempts += 1;
      if (rec.attempts >= OTP_MAX_ATTEMPTS) {
        rec.lockoutUntil = Date.now() + OTP_LOCKOUT_MINUTES * 60 * 1000;
        return {
          ok: false,
          code: "locked",
          lockoutUntil: new Date(rec.lockoutUntil).toISOString(),
        };
      }
      return fail();
    }
    otpStore.delete(phoneE164);
    return { ok: true };
  },

  async nameEnquiry(input): Promise<HolderInfo> {
    await new Promise((r) => setTimeout(r, 400));
    const resolved = resolveDestinationLabel(input);
    return {
      holderName: resolved.name,
      maskedDestination: resolved.masked,
      railLabel: resolved.label,
    };
  },

  async createAccount(params): Promise<AccountResult> {
    const cached = idempotency.get(params.idempotencyKey);
    if (cached) return cached;

    const draft = getDraftMemory(params.draftId);
    if (!draft) {
      const result: AccountResult = {
        ok: false,
        code: "unknown",
        message: "Draft not found",
      };
      return result;
    }

    await new Promise((r) => setTimeout(r, 800));

    let baseSlug = slugify(params.shopName) || "shop";
    if (registeredPhones.size > 0 && baseSlug === "amara-beads") {
      baseSlug = `${baseSlug}-${registeredPhones.size + 1}`;
    }
    const accountId = `acc_${params.phoneE164.replace(/\D/g, "").slice(-8)}`;

    registeredPhones.set(params.phoneE164, {
      shopName: params.shopName,
      productCount: 1,
      joinedAt: new Date().toISOString(),
    });

    saveDraftMemory({ ...draft, updatedAt: new Date().toISOString() });

    const result: AccountResult = {
      ok: true,
      shopSlug: baseSlug,
      accountId,
      migratedDraft: draft,
    };
    idempotency.set(params.idempotencyKey, result);
    return result;
  },
};

/** Test helper: mark a phone as already registered */
export function mockRegisterPhone(phoneE164: string, shop: RegisteredShop) {
  registeredPhones.set(phoneE164, shop);
}

export function mockGetRegistered(phoneE164: string) {
  return registeredPhones.get(phoneE164);
}

export function nationalFromE164(countryCode: NameEnquiryInput["countryCode"], e164: string): string {
  const country = getCountryByCode(countryCode);
  const digits = e164.replace(/\D/g, "").replace(country.dial.replace("+", ""), "");
  return digits.startsWith("0") ? digits : `0${digits}`;
}

export { toE164 };
