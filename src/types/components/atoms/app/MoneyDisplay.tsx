import { cn } from "@/lib/utils";

const zeroDecimalCurrencies = new Set([
  "RWF",
  "KES",
  "NGN",
  "KRW",
  "JPY",
  "XOF",
]);

interface MoneyDisplayProps {
  currency?: string;
  amount: number | null;
  cap?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MoneyDisplay({
  currency = "US$",
  amount,
  cap,
  size = "md",
  className,
}: MoneyDisplayProps) {
  if (amount === null) {
    return <span className="text-text-muted">—</span>;
  }

  const isZeroDecimal = zeroDecimalCurrencies.has(currency);
  const formatted = isZeroDecimal
    ? amount.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-[28px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-0.5 font-mono font-medium tnum",
        sizeClasses[size],
        className
      )}
    >
      <span className="text-text-subtle">{currency}</span>
      <span>{formatted}</span>
      {cap !== undefined && (
        <span className="text-sm text-text-muted">
          / {cap.toLocaleString()}
        </span>
      )}
    </span>
  );
}
