import type { EventTone, TimelineEvent } from "@/types/app";
import { StatusDot } from "@/components/atoms/app/StatusDot";
import { WhyPopover } from "@/components/molecules/app/WhyPopover";
import { cn } from "@/lib/utils";

const toneTextColors: Record<EventTone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface p-5",
        className
      )}
    >
      <h2 className="mb-3 text-[15px] font-semibold text-text">
        What SolAI did for you today
      </h2>
      <div className="flex flex-col">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex gap-2.5 border-b border-border py-2.5 last:border-b-0"
          >
            <StatusDot tone={event.type} className="mt-1.5" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2 text-xs">
                <span
                  className={cn("font-medium", toneTextColors[event.type])}
                >
                  {event.agent}
                </span>
                <span className="text-text-subtle">{event.time}</span>
                {event.why && (
                  <WhyPopover
                    decision={event.why}
                    className="ml-auto"
                  />
                )}
              </div>
              <p className="text-[13px] text-text-muted">{event.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
