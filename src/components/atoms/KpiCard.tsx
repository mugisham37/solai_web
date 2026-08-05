"use client";

import { CountUp } from "@/components/atoms/CountUp";
import { cn } from "@/lib/cn";

type KpiCardProps = {
  label: string;
  value: number;
  /** Supporting line under the value — not a link target. */
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  locale?: string;
  className?: string;
};

/**
 * Fact card, not a door. KPI cards must not be wrapped in links — tapping a
 * number that goes nowhere teaches sellers to fear the interface.
 */
export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  locale = "en",
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "rounded-tile border border-hair bg-white p-[0.78rem] @container",
        className,
      )}
    >
      <p className="text-[0.7rem] font-semibold text-ink-45">{label}</p>
      <p className="mt-0.5 font-display text-[1.35rem] leading-[1.05] font-extrabold tracking-tight text-ink">
        <CountUp value={value} locale={locale} />
      </p>
      {delta ? (
        <p
          className={cn(
            "mt-0.5 text-[0.69rem] font-bold",
            deltaTone === "up" && "text-sea-muted",
            deltaTone === "down" && "text-clay",
            deltaTone === "neutral" && "text-ink-45",
          )}
        >
          {delta}
        </p>
      ) : null}
    </div>
  );
}
