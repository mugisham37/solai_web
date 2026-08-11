"use client";

import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { StatusChip } from "@/components/atoms/StatusChip";
import type { IconName } from "@/types/icon";
import { cn } from "@/lib/cn";

type PaymentMethodOptionProps = {
  selected: boolean;
  onSelect: () => void;
  icon: IconName;
  iconTone?: "sun" | "neutral";
  title: string;
  subtitle: string;
  badge?: string;
  children?: React.ReactNode;
};

export function PaymentMethodOption({
  selected,
  onSelect,
  icon,
  iconTone = "neutral",
  title,
  subtitle,
  badge,
  children,
}: PaymentMethodOptionProps) {
  return (
    <div>
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        className={cn(
          "flex w-full items-start gap-3 rounded-tile border bg-white p-3.5 text-left transition-colors",
          selected ? "border-sun bg-sun/10" : "border-ink-20 hover:border-ink-45",
        )}
        onClick={onSelect}
      >
        <span
          className={cn(
            "relative mt-0.5 size-[19px] shrink-0 rounded-full border-2",
            selected ? "border-sun bg-sun" : "border-ink-20",
          )}
        >
          {selected ? (
            <span className="absolute inset-[3px] rounded-full bg-sun-ink" />
          ) : null}
        </span>
        <IconTile variant={iconTone === "sun" ? "sun" : "neutral"}>
          <Icon name={icon} size="md" />
        </IconTile>
        <span className="flex-1">
          <span className="block text-[0.92rem] font-bold">{title}</span>
          <span className="text-[0.74rem] text-ink-45">{subtitle}</span>
        </span>
        {badge ? <StatusChip label={badge} tone="sun" /> : null}
      </button>
      {selected && children ? (
        <div className="mt-[-0.35rem] flex flex-col gap-3 rounded-b-tile border border-t-0 border-hair bg-paper-2 p-3.5">
          {children}
        </div>
      ) : null}
    </div>
  );
}
