"use client";

import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { cn } from "@/lib/cn";

type SaleToggleProps = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  title: string;
  subtitle: string;
  label: string;
  disabled?: boolean;
};

/** On-sale switch — live and out-of-stock both count as on sale. */
export function SaleToggle({
  checked,
  onCheckedChange,
  title,
  subtitle,
  label,
  disabled,
}: SaleToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-tile border border-hair bg-paper-2 px-3 py-3">
      <span className="flex min-w-0 items-center gap-2.5">
        <IconTile variant="sea">
          <Icon name="store" />
        </IconTile>
        <span className="min-w-0">
          <span className="block text-[0.91rem] font-bold text-ink">{title}</span>
          <span className="block text-[0.73rem] text-ink-45">{subtitle}</span>
        </span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-sea" : "bg-ink-20",
          disabled && "opacity-50",
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
