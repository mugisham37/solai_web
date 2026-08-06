"use client";

import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";

type QuantityStepperProps = {
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
  fewerLabel: string;
  moreLabel: string;
  className?: string;
};

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  label,
  fewerLabel,
  moreLabel,
  className,
}: QuantityStepperProps) {
  return (
    <span
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center overflow-hidden rounded-pill border border-ink-20 bg-white",
        className,
      )}
    >
      <button
        type="button"
        aria-label={fewerLabel}
        disabled={value <= min}
        className="grid size-[42px] w-10 place-items-center hover:bg-paper-2 disabled:opacity-40"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Icon name="minus" size="md" />
      </button>
      <span className="min-w-[34px] text-center font-bold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label={moreLabel}
        disabled={value >= max}
        className="grid size-[42px] w-10 place-items-center hover:bg-paper-2 disabled:opacity-40"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Icon name="plus" size="md" />
      </button>
    </span>
  );
}
