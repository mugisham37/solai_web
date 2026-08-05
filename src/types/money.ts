export type CurrencyCode = "RWF" | "UGX" | "KES" | "TZS";

export type Money = Readonly<{
  amountMinor: number;
  currency: CurrencyCode;
}>;
