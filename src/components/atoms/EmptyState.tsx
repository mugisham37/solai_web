import type { ReactNode } from "react";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";

type EmptyStateProps = {
  icon: IconName;
  title: string;
  description: string;
  /** "good" is for empty Needs-you — silence is the desired state. */
  tone?: "neutral" | "good";
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  tone = "neutral",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-hair bg-white px-4 py-[2.2rem] text-center",
        tone === "good" && "border-sea/30 bg-sea/5",
        className,
      )}
    >
      <span
        className={cn(
          "mx-auto mb-3.5 grid size-14 place-items-center rounded-[18px]",
          tone === "good" ? "bg-sea/15 text-sea-muted" : "bg-paper-2 text-ink-45",
        )}
      >
        <Icon name={icon} size="lg" className="size-[26px]" />
      </span>
      <p className="font-display text-[0.97rem] font-bold tracking-tight text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-[34ch] text-sm text-ink-70">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
