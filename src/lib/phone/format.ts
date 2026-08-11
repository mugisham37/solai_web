import { isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js/min";
import type { CountryCode } from "@/data/countries";

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Group national digits as 3-3-3 for display. */
export function formatNationalDisplay(digits: string): string {
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

export function toE164(countryIso: CountryCode, nationalDigits: string): string | null {
  const parsed = parsePhoneNumberFromString(nationalDigits, countryIso);
  if (!parsed?.isValid()) return null;
  return parsed.number;
}

export function isValidNationalPhone(countryIso: CountryCode, nationalDigits: string): boolean {
  const parsed = parsePhoneNumberFromString(nationalDigits, countryIso);
  if (parsed?.isValid()) return true;
  return isValidPhoneNumber(nationalDigits, countryIso);
}

export function formatE164ForDisplay(e164: string): string {
  const parsed = parsePhoneNumberFromString(e164);
  if (!parsed) return e164;
  return parsed.formatInternational();
}

export function maskPhoneE164(e164: string): string {
  const parsed = parsePhoneNumberFromString(e164);
  if (!parsed) return e164;
  const national = parsed.formatNational();
  const d = digitsOnly(national);
  if (d.length < 4) return parsed.formatInternational();
  const visible = d.slice(-3);
  const country = parsed.countryCallingCode;
  return `+${country} ${d.slice(0, 3)} ••• ${visible}`;
}
