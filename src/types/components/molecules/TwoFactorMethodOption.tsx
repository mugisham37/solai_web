"use client";

import { cn } from "@/lib/utils";

interface TwoFactorMethodOptionProps {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function TwoFactorMethodOption({
  selected,
  onSelect,
  icon,
  title,
  description,
}: TwoFactorMethodOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border-[1.5px] p-4 text-left transition-colors duration-120 hover:border-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        selected
          ? "border-brand bg-brand-soft"
          : "border-border bg-transparent",
      )}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-md bg-surface-2 text-text-muted",
          selected && "bg-brand/15 text-brand",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <strong className="block text-sm font-semibold text-text">{title}</strong>
        <p className="mt-0.5 text-xs text-text-muted">{description}</p>
      </div>
      <div
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-border",
          selected && "border-brand",
        )}
      >
        {selected ? (
          <div className="size-2 rounded-full bg-brand" />
        ) : null}
      </div>
    </button>
  );
}
