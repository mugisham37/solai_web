"use client";

import { CountUp } from "@/components/atoms/CountUp";
import { toMajorUnits } from "@/lib/money";
import type { Money } from "@/types/money";
import { cn } from "@/lib/cn";

type MoneyCountProps = {
  value: Money;
  locale: string;
  className?: string;
  animate?: boolean;
};

/**
 * Animated money figure using the same minor-unit Money type as MoneyDisplay.
 * Currency stays outside the count so the number can ease without reformatting mid-tick.
 */
export function MoneyCount({ value, locale, className, animate = true }: MoneyCountProps) {
  const major = toMajorUnits(value);

  return (
    <span className={cn("tabular-nums font-bold", className)}>
      {value.currency}{" "}
      <CountUp value={major} locale={locale} animate={animate} />
    </span>
  );
}
