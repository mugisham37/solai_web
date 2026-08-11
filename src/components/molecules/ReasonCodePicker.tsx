"use client";

import { cn } from "@/lib/cn";

type ReasonCodePickerProps = {
  options: readonly { key: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

/** Labelled toggle group — free text alone is never enough. */
export function ReasonCodePicker({
  options,
  value,
  onChange,
  disabled = false,
  label = "Reason code · required",
  className,
}: ReasonCodePickerProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
        {label}
      </span>
      <div
        role="group"
        aria-label={label}
        className="flex flex-wrap gap-1.5"
      >
        {options.map((opt) => {
          const pressed = value === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              aria-pressed={pressed}
              disabled={disabled}
              className={cn(
                "inline-flex min-h-9 items-center rounded-pill border px-3 text-[0.72rem] font-bold transition-colors",
                pressed
                  ? "border-sun bg-sun text-sun-ink"
                  : "border-ink-20 bg-transparent text-ink-70 hover:bg-paper-2",
                disabled && "opacity-50",
              )}
              onClick={() => onChange(opt.key)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
