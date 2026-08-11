"use client";

import { cn } from "@/lib/cn";

type VariantChipGroupProps = {
  variants: readonly string[];
  value: string;
  onChange: (variant: string) => void;
  className?: string;
};

export function VariantChipGroup({
  variants,
  value,
  onChange,
  className,
}: VariantChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {variants.map((v) => {
        const pressed = v === value;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={pressed}
            className={cn(
              "inline-flex items-center rounded-pill border px-2.5 py-1 text-[0.72rem] font-bold transition-colors",
              pressed
                ? "border-sun bg-sun/10 text-ink"
                : "border-ink-20 bg-transparent text-ink-70 hover:border-ink-45",
            )}
            onClick={() => onChange(v)}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}
