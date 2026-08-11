import type { Money } from "@/types/money";

const MINOR_DIVISOR: Record<string, number> = {
  RWF: 1,
  UGX: 1,
  KES: 100,
  TZS: 1,
  USD: 100,
  EUR: 100,
};

export function toMajorUnits({ amountMinor, currency }: Money): number {
  const divisor = MINOR_DIVISOR[currency] ?? 100;
  return amountMinor / divisor;
}

export function formatMoney(
  { amountMinor, currency }: Money,
  locale: string,
): string {
  const divisor = MINOR_DIVISOR[currency] ?? 100;
  const major = toMajorUnits({ amountMinor, currency });
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: divisor === 1 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(major);

  return `${currency} ${formatted}`;
}

export function formatMoneyCompact(
  { amountMinor, currency }: Money,
  locale: string,
): string {
  const major = toMajorUnits({ amountMinor, currency });
  if (major >= 1_000_000) {
    const m = major / 1_000_000;
    const n = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(m);
    return `${currency} ${n}M`;
  }
  return formatMoney({ amountMinor, currency }, locale);
}
