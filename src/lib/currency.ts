import { CURRENCY_RATES, ZERO_DECIMAL_CURRENCIES } from "@/data/marketing/pricing";
import type { CurrencyCode } from "@/types/marketing";

export function formatCurrency(usdAmount: number, currency: CurrencyCode): string {
  const value = usdAmount * CURRENCY_RATES[currency];
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(currency);

  const formatted = isZeroDecimal
    ? Math.round(value).toLocaleString("en-US")
    : value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  return `${currency} ${formatted}`;
}
