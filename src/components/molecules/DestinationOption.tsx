"use client";

import type { ReactNode } from "react";
import { Chip } from "@/components/atoms/Chip";
import { cn } from "@/lib/cn";

type DestinationOptionProps = {
  id: string;
  title: string;
  subtitle: string;
  meta: ReactNode;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  reveal: ReactNode;
  revealOpen: boolean;
};

export function DestinationOption({
  id,
  title,
  subtitle,
  meta,
  selected,
  disabled,
  onSelect,
  reveal,
  revealOpen,
}: DestinationOptionProps) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        role="radio"
        id={id}
        aria-checked={selected}
        disabled={disabled}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            const group = e.currentTarget.closest('[role="radiogroup"]');
            const radios = group?.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
            if (!radios) return;
            const idx = [...radios].indexOf(e.currentTarget);
            radios[(idx + 1) % radios.length]?.focus();
          }
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            const group = e.currentTarget.closest('[role="radiogroup"]');
            const radios = group?.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
            if (!radios) return;
            const idx = [...radios].indexOf(e.currentTarget);
            radios[(idx - 1 + radios.length) % radios.length]?.focus();
          }
        }}
        className={cn(
          "flex min-h-11 w-full cursor-pointer items-start gap-2.5 rounded-tile border border-ink-20 bg-white p-3.5 text-left transition-colors hover:border-ink-45 disabled:cursor-not-allowed disabled:opacity-50",
          selected && "border-sun bg-sun/7",
          revealOpen && "rounded-b-none border-b-0",
        )}
      >
        <span
          className={cn(
            "relative mt-0.5 size-[19px] shrink-0 rounded-full border-2 border-ink-20",
            selected && "border-sun bg-sun",
          )}
          aria-hidden
        >
          {selected ? (
            <span className="absolute inset-[3px] rounded-full bg-sun-ink" />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.93rem] font-bold leading-snug">{title}</span>
          <span className="mt-0.5 block text-xs text-ink-45">{subtitle}</span>
        </span>
        <span className="shrink-0 text-right">{meta}</span>
      </button>
      <div
        className={cn(
          "flex flex-col gap-3 rounded-b-tile border border-t-0 border-hair bg-paper-2 p-3.5",
          !revealOpen && "hidden",
        )}
        role="region"
        aria-labelledby={id}
      >
        {reveal}
      </div>
    </div>
  );
}

export function DestinationMetaInstant({ label }: { label: string }) {
  return (
    <Chip variant="live" className="text-[0.73rem]">
      {label}
    </Chip>
  );
}

export function DestinationMetaSlower({ label }: { label: string }) {
  return (
    <Chip variant="line" className="text-[0.73rem]">
      {label}
    </Chip>
  );
}
