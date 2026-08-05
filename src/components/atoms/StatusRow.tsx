import type { ReactNode } from "react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";

type StatusRowProps = {
  status: "done" | "waiting";
  /** Spoken before the title so the state never rests on the icon alone. */
  statusLabel: string;
  title: string;
  subtitle: string;
  /** Icon for the waiting marker; the done marker is always a tick. */
  waitingIcon?: IconName;
  trailing?: ReactNode;
  className?: string;
};

export function StatusRow({
  status,
  statusLabel,
  title,
  subtitle,
  waitingIcon = "clock",
  trailing,
  className,
}: StatusRowProps) {
  const done = status === "done";

  return (
    <li
      className={cn(
        "flex items-center gap-2.5 py-2.5 [&+&]:border-t [&+&]:border-hair",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-[26px] shrink-0 place-items-center rounded-full",
          done ? "bg-sea text-white" : "bg-paper-2 text-ink-45",
        )}
        aria-hidden
      >
        <Icon name={done ? "check" : waitingIcon} size="sm" className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="sr-only">{statusLabel}. </span>
        <span className="text-[0.93rem] font-bold leading-snug">{title}</span>
        <span className="mt-0.5 block text-[0.76rem] leading-snug text-ink-45">{subtitle}</span>
      </span>
      {trailing}
    </li>
  );
}
