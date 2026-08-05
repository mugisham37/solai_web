import { cn } from "@/lib/cn";
import { getOrderStatus } from "@/lib/dashboard/status";
import type { OrderStatus, StatusChipTone } from "@/types/dashboard";

const toneClass: Record<StatusChipTone, string> = {
  held: "bg-berry/15 text-berry-muted",
  live: "bg-sea/15 text-sea-muted before:size-1.5 before:rounded-full before:bg-sea before:content-[''] motion-safe:before:animate-pulse",
  line: "border border-ink-20 bg-transparent text-ink-70",
  clay: "bg-clay/10 text-clay",
  grey: "bg-paper-2 text-ink-45",
  sun: "bg-sun text-sun-ink",
};

type StatusChipProps = {
  /** Order status — colour + pulse come from the shared STATUS map. */
  status?: OrderStatus;
  /** Pre-resolved label (required so RSC parents can pass translations). */
  label: string;
  /** Override tone for non-order chips (e.g. product live/oos). */
  tone?: StatusChipTone;
  className?: string;
};

/**
 * Status as text plus colour. Never colour alone — the label is the readable signal.
 */
export function StatusChip({ status, label, tone, className }: StatusChipProps) {
  const resolvedTone = tone ?? (status ? getOrderStatus(status).tone : "grey");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.71rem] font-bold whitespace-nowrap",
        toneClass[resolvedTone],
        className,
      )}
    >
      {label}
    </span>
  );
}
