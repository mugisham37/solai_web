"use client";

import { AiField } from "@/components/molecules/AiField";
import { ConfidencePips } from "@/components/atoms/ConfidencePips";
import type { PriceSuggestion } from "@/types/build";
import { cn } from "@/lib/cn";

type PriceFieldProps = {
  label: React.ReactNode;
  aiBadge: string;
  restoreLabel: string;
  originalDisplay: string;
  valueDisplay: string;
  onChange: (minor: number) => void;
  onBlur?: () => void;
  price: PriceSuggestion;
  confidenceLabel: string;
  whyLabel: string;
  onWhy: () => void;
  rangeHint: string;
};

export function PriceField({
  label,
  aiBadge,
  restoreLabel,
  originalDisplay,
  valueDisplay,
  onChange,
  onBlur,
  price,
  confidenceLabel,
  whyLabel,
  onWhy,
  rangeHint,
}: PriceFieldProps) {
  const markerPct = Math.max(
    2,
    Math.min(
      97,
      ((price.amountMinor - price.rangeLowMinor) /
        (price.rangeHighMinor - price.rangeLowMinor)) *
        100,
    ),
  );

  return (
    <AiField
      label={label}
      aiBadge={aiBadge}
      restoreLabel={restoreLabel}
      originalValue={originalDisplay}
      value={valueDisplay}
      onChange={() => {}}
      onBlur={onBlur}
      hint={<span className="text-xs text-ink-45">{rangeHint}</span>}
    >
      <div className="flex overflow-hidden rounded-xl border border-ink-20 bg-white">
        <span className="flex items-center border-r border-ink-20 bg-paper-2 px-3 py-3 font-bold">
          RWF
        </span>
        <input
          className="min-h-11 flex-1 px-3 py-3 text-base outline-none"
          inputMode="numeric"
          value={valueDisplay}
          onChange={(e) => {
            const n = parseInt(e.target.value.replace(/[^\d]/g, ""), 10);
            if (!Number.isNaN(n)) onChange(n);
          }}
          onBlur={onBlur}
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <ConfidencePips level={price.confidence} label={confidenceLabel} />
        <button type="button" className="text-xs font-semibold text-ink-45 hover:text-ink" onClick={onWhy}>
          {whyLabel}
        </button>
      </div>
      <div className="relative mt-2 h-8 overflow-hidden rounded-lg bg-paper-2" aria-hidden>
        <span
          className="absolute inset-y-0 bg-sea/30"
          style={{
            left: `${((price.rangeLowMinor - price.rangeLowMinor) / (price.rangeHighMinor - price.rangeLowMinor)) * 100}%`,
            right: `${100 - ((8500 - price.rangeLowMinor) / (price.rangeHighMinor - price.rangeLowMinor)) * 100}%`,
          }}
        />
        <span
          className={cn("absolute -top-0.5 bottom-0 w-0.5 rounded-sm bg-sun transition-[left]")}
          style={{ left: `${markerPct}%` }}
        />
      </div>
    </AiField>
  );
}
