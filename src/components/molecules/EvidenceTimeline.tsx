import { cn } from "@/lib/cn";
import type { EvidenceEvent } from "@/types/console";

type EvidenceTimelineProps = {
  events: readonly EvidenceEvent[];
  className?: string;
};

const toneDot: Record<string, string> = {
  ok: "bg-sea",
  hold: "bg-berry",
  bad: "bg-clay",
  "": "bg-ink-20",
};

/** System-assembled evidence — agents read it; they do not type it. */
export function EvidenceTimeline({ events, className }: EvidenceTimelineProps) {
  return (
    <ol className={cn("relative flex flex-col gap-0", className)}>
      {events.map((event, i) => (
        <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
          {i < events.length - 1 ? (
            <span
              aria-hidden
              className="absolute top-3 left-[7px] h-[calc(100%-4px)] w-px bg-hair"
            />
          ) : null}
          <span
            aria-hidden
            className={cn(
              "relative z-[1] mt-1.5 size-3.5 shrink-0 rounded-full",
              toneDot[event.tone] ?? toneDot[""],
            )}
          />
          <div className="min-w-0 flex-1">
            <p className="m-0 text-sm font-bold text-ink">
              {event.timeLabel} · {event.title}
            </p>
            <p className="mt-0.5 text-[0.74rem] leading-snug text-ink-45">
              {event.detail}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
