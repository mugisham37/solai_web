"use client";

import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type ConsentCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  error?: string;
};

export function ConsentCheckbox({ checked, onChange, children, error }: ConsentCheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={cn(
            "grid size-[22px] shrink-0 place-items-center rounded-md border-2 border-ink-20 text-transparent transition-colors peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-sun peer-checked:border-sea peer-checked:bg-sea peer-checked:text-white",
          )}
          aria-hidden
        >
          <Icon name="check" size="sm" />
        </span>
        <span className="text-sm text-ink-70">{children}</span>
      </label>
      {error ? <p className="text-[0.76rem] font-semibold text-clay">{error}</p> : null}
    </div>
  );
}
