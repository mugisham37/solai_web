"use client";

import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";

type ChannelButtonProps = {
  icon: IconName;
  label: string;
  /**
   * Brand colour for the icon tile. Platform colours are what make this grid
   * scannable at a glance, so they are passed in rather than tokenised.
   */
  tileClassName: string;
  shared: boolean;
  /** Spoken after the platform name, so the tick is never the only signal. */
  sharedLabel: string;
  onClick: () => void;
  className?: string;
};

export function ChannelButton({
  icon,
  label,
  tileClassName,
  shared,
  sharedLabel,
  onClick,
  className,
}: ChannelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      /* The state is in the accessible name, not just the tick. */
      aria-label={shared ? `${label} — ${sharedLabel}` : label}
      className={cn(
        "relative flex min-h-[88px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-tile border border-hair bg-white px-1.5 py-3.5",
        "transition-[border-color,transform] duration-150 hover:border-ink-45",
        "motion-safe:hover:-translate-y-0.5",
        className,
      )}
    >
      {shared ? (
        <span
          className="absolute right-1.5 top-1.5 grid size-[17px] place-items-center rounded-full bg-sea text-white"
          aria-hidden
        >
          <Icon name="check" size="sm" className="size-2.5 stroke-[3]" />
        </span>
      ) : null}

      <span
        className={cn("grid size-10 place-items-center rounded-[13px] text-white", tileClassName)}
        aria-hidden
      >
        <Icon name={icon} className="size-[21px]" />
      </span>

      <span className="text-center text-[0.72rem] font-bold leading-tight">{label}</span>
    </button>
  );
}
