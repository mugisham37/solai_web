"use client";

import { cn } from "@/lib/cn";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
};

export function ToggleSwitch({ checked, onChange, label, className }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn(
        "relative h-[25px] w-11 shrink-0 rounded-pill transition-colors",
        checked ? "bg-sea" : "bg-ink-20",
        className,
      )}
      onClick={() => onChange(!checked)}
    >
      <span
        className={cn(
          "absolute top-[3px] left-[3px] size-[19px] rounded-full bg-white transition-transform",
          checked && "translate-x-[19px]",
        )}
      />
    </button>
  );
}
