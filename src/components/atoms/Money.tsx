import { formatMoney } from "@/lib/money";
import type { Money } from "@/types/money";
import { cn } from "@/lib/cn";

type MoneyDisplayProps = {
  value: Money;
  locale: string;
  className?: string;
};

export function MoneyDisplay({ value, locale, className }: MoneyDisplayProps) {
  return (
    <span className={cn("tabular-nums font-bold", className)}>{formatMoney(value, locale)}</span>
  );
}
