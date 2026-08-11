import { cn } from "@/lib/cn";
import { slaLevel } from "@/lib/console/derive";

type SlaChipProps = {
  hours: number;
  /** Closed cases show a closed label instead of SLA. */
  closed?: boolean;
  closedLabel?: string;
  className?: string;
};

/**
 * SLA state as text + colour. Never colour alone — the label is the readable signal.
 * One definition used on the queue, overview, and case header.
 */
export function SlaChip({
  hours,
  closed = false,
  closedLabel = "Closed",
  className,
}: SlaChipProps) {
  if (closed) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-pill bg-sea/15 px-2.5 py-1 text-[0.71rem] font-bold whitespace-nowrap text-sea-muted",
          className,
        )}
      >
        {closedLabel}
      </span>
    );
  }

  const level = slaLevel(hours);
  const label =
    level === "breached"
      ? "Breached"
      : `${hours}h left`;

  const tone =
    level === "breached" || level === "urgent"
      ? "bg-clay/10 text-clay"
      : level === "soon"
        ? "bg-berry/15 text-berry-muted"
        : "border border-ink-20 bg-transparent text-ink-70";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 text-[0.71rem] font-bold whitespace-nowrap",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
