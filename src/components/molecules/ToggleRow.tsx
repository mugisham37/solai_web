"use client";

import { cn } from "@/lib/cn";

type ToggleRowProps = {
  title: string;
  subtitle: string;
  checked: boolean;
  onCheckedChange?: (next: boolean) => void;
  disabled?: boolean;
  /** When false, the switch is display-only (decorative catalogue prefs). */
  interactive?: boolean;
  className?: string;
};

export function ToggleRow({
  title,
  subtitle,
  checked,
  onCheckedChange,
  disabled,
  interactive = true,
  className,
}: ToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-1 py-3",
        className,
      )}
    >
      <span className="min-w-0">
        <span className="block text-[0.91rem] font-bold text-ink">{title}</span>
        <span className="block text-[0.73rem] text-ink-45">{subtitle}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled || !interactive}
        onClick={() => {
          if (!interactive || disabled) return;
          onCheckedChange?.(!checked);
        }}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-sea" : "bg-ink-20",
          (disabled || !interactive) && "opacity-70",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}
