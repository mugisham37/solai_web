"use client";

import { cn } from "@/lib/cn";
import type { CaseOutcome } from "@/types/console";

export type OutcomeOption = Readonly<{
  key: CaseOutcome;
  title: string;
  subtitle: string;
  actLabel: string;
  buttonVariant: "sea" | "clay" | "sun" | "line";
}>;

type OutcomePickerProps = {
  options: readonly OutcomeOption[];
  value: CaseOutcome | null;
  onChange: (value: CaseOutcome) => void;
  disabled?: boolean;
  className?: string;
};

export function OutcomePicker({
  options,
  value,
  onChange,
  disabled = false,
  className,
}: OutcomePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Outcome"
      className={cn("flex flex-col gap-2", className)}
    >
      {options.map((opt) => {
        const checked = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            className={cn(
              "flex min-h-11 w-full items-start gap-3 rounded-tile border bg-white px-3.5 py-3 text-left transition-colors",
              checked
                ? "border-sun bg-sun/[0.07]"
                : "border-ink-20 hover:border-ink-45",
              disabled && "opacity-50",
            )}
            onClick={() => onChange(opt.key)}
          >
            <span
              aria-hidden
              className={cn(
                "relative mt-0.5 size-[19px] shrink-0 rounded-full border-2",
                checked ? "border-sun bg-sun" : "border-ink-20",
              )}
            >
              {checked ? (
                <span className="absolute inset-[3px] rounded-full bg-sun-ink" />
              ) : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.92rem] font-bold text-ink">
                {opt.title}
              </span>
              <span className="block text-[0.74rem] text-ink-45">
                {opt.subtitle}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
