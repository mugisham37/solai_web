"use client";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { formatCurrencyAmount } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface BudgetSliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  currency: string;
  onChange: (value: number) => void;
  className?: string;
}

export function BudgetSliderField({
  label,
  value,
  min,
  max,
  step,
  currency,
  onChange,
  className,
}: BudgetSliderFieldProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-5",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm text-text-muted">{label}</span>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="tnum h-8 w-24 border-border bg-bg text-right font-mono text-sm"
            aria-label={`${label} numeric input`}
          />
          <span className="tnum font-mono text-lg font-semibold text-text">
            {formatCurrencyAmount(value, currency)}
          </span>
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="py-2"
        aria-label={label}
      />
      <div className="mt-1 flex justify-between font-mono text-[11px] text-text-subtle">
        <span>{formatCurrencyAmount(min, currency)}</span>
        <span>{formatCurrencyAmount(max, currency)}</span>
      </div>
    </div>
  );
}
