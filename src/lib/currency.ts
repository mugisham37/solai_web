export const currencyRates = {
  "US$": 1,
  EUR: 0.92,
  RWF: 1350,
  KES: 153,
  NGN: 1550,
  ZAR: 18.5,
} as const;

export const zeroDecimalCurrencies = ["RWF", "KES", "NGN"] as const;

export type CurrencyCode = keyof typeof currencyRates;

export const onboardingCurrencies = ["US$", "RWF", "KES", "EUR"] as const;

export type OnboardingCurrencyCode = (typeof onboardingCurrencies)[number];

export function formatCurrencyAmount(
  amount: number,
  currency: string,
): string {
  const rate = currencyRates[currency as CurrencyCode] ?? 1;
  const val = amount * rate;
  const isZeroDec = (zeroDecimalCurrencies as readonly string[]).includes(
    currency,
  );
  const formatted = isZeroDec
    ? Math.round(val).toLocaleString()
    : val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  return `${currency} ${formatted}`;
}

export function formatPrice(usd: number, currency: CurrencyCode): string {
  return formatCurrencyAmount(usd, currency);
}
