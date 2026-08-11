import { getCountryByCode, type CountryCode } from "@/data/countries";
import { getBankById } from "@/lib/payout/banks";
import { toE164 } from "@/lib/phone/format";
import type { DestinationKind, PayoutFormSnapshot, WalletMode } from "@/types/payout";

export function buildFormSnapshot(input: {
  countryCode: CountryCode;
  phoneNational: string;
  phoneDisplay: string;
  phoneE164: string;
  detectedNetworkId: string | null;
  destinationKind: DestinationKind;
  walletMode: WalletMode;
  walletPhoneNational?: string;
  airtelPhoneNational?: string;
  bankId?: string;
  accountNumber?: string;
  shopName: string;
  consent: boolean;
}): PayoutFormSnapshot {
  const walletE164 =
    input.walletPhoneNational && input.walletMode === "other"
      ? toE164(input.countryCode, input.walletPhoneNational)
      : undefined;
  const airtelE164 = input.airtelPhoneNational
    ? toE164(input.countryCode, input.airtelPhoneNational)
    : undefined;
  const bank = input.bankId ? getBankById(input.bankId) : undefined;
  return {
    countryCode: input.countryCode,
    phoneE164: input.phoneE164,
    phoneDisplay: input.phoneDisplay,
    detectedNetworkId: input.detectedNetworkId,
    destinationKind: input.destinationKind,
    walletMode: input.walletMode,
    walletPhoneE164: walletE164 ?? undefined,
    airtelPhoneE164: airtelE164 ?? undefined,
    bankId: input.bankId,
    bankName: bank?.name,
    accountNumber: input.accountNumber,
    shopName: input.shopName.trim(),
    consent: input.consent,
  };
}

/** Third-party = name check required before OTP. */
export function requiresHolderConfirm(snapshot: PayoutFormSnapshot): boolean {
  if (snapshot.destinationKind === "airtel") return true;
  if (snapshot.destinationKind === "bank") return true;
  if (snapshot.destinationKind === "wallet" && snapshot.walletMode === "other") return true;
  return false;
}

export function nameEnquiryFromSnapshot(snapshot: PayoutFormSnapshot) {
  return {
    countryCode: snapshot.countryCode,
    currency: getCountryByCode(snapshot.countryCode).currency,
    destinationKind: snapshot.destinationKind,
    walletMode: snapshot.walletMode,
    phoneE164: snapshot.phoneE164,
    walletPhoneE164: snapshot.walletPhoneE164,
    airtelPhoneE164: snapshot.airtelPhoneE164,
    bankId: snapshot.bankId,
    accountNumber: snapshot.accountNumber,
    detectedNetworkId: snapshot.detectedNetworkId,
  };
}
