import type { BuyerOrderEvent } from "@/types/buyer";
import { cn } from "@/lib/cn";

type OrderTimelineProps = {
  events: readonly BuyerOrderEvent[];
  className?: string;
};

const toneColor: Record<BuyerOrderEvent["tone"], string> = {
  ok: "bg-sea",
  hold: "bg-berry",
  wait: "bg-ink-20",
  bad: "bg-clay",
};

export function OrderTimeline({ events, className }: OrderTimelineProps) {
  return (
    <div className={cn("relative pl-[1.15rem]", className)}>
      <span className="absolute top-2 bottom-2 left-[5px] w-0.5 bg-hair" />
      {events.map((e) => (
        <div key={e.id} className="relative py-[0.42rem]">
          <span
            className={cn(
              "absolute top-[0.72rem] left-[-1.15rem] size-2.5 rounded-full border-2 border-white",
              toneColor[e.tone],
            )}
          />
          <p className="text-[0.96rem] font-bold text-ink">{e.title}</p>
          <p className="text-[0.74rem] text-ink-45">
            {e.whenLabel} · {e.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}
