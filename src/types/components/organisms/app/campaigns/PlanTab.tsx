import type {
  AgentAction,
  Audience,
  AudienceStatus,
  ChannelAllocation,
} from "@/types/app";
import { MoneyDisplay } from "@/components/atoms/app/MoneyDisplay";
import { WhyPopover } from "@/components/molecules/app/WhyPopover";

const audienceStatusStyles: Record<
  AudienceStatus,
  { bg: string; color: string }
> = {
  scaling: { bg: "rgba(52,211,153,0.12)", color: "var(--success)" },
  steady: { bg: "var(--brand-soft)", color: "var(--brand)" },
  learning: { bg: "rgba(122,167,255,0.12)", color: "var(--info)" },
};

interface PlanTabProps {
  allocations: ChannelAllocation[];
  audiences: Audience[];
  agentActions: AgentAction[];
}

export function PlanTab({ allocations, audiences, agentActions }: PlanTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
      <section className="rounded-lg border border-border bg-surface p-5">
        <h3 className="mb-1 text-[15px] font-semibold text-text">
          Channel allocation
        </h3>
        <p className="mb-4 text-xs text-text-subtle">
          Auto-rebalanced every 15 min by Optimizer Agent based on rolling
          ROAS.
        </p>
        <div className="mb-3.5 flex h-2 overflow-hidden rounded-pill bg-surface-2">
          {allocations.map((allocation) => (
            <div
              key={allocation.channel}
              style={{
                width: `${allocation.pct}%`,
                background: allocation.color,
              }}
              title={`${allocation.channel}: ${allocation.pct}%`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {allocations.map((allocation) => (
            <div
              key={allocation.channel}
              className="grid grid-cols-[14px_1fr_40px_80px_50px] items-center gap-2.5 text-sm"
            >
              <div
                className="size-2.5 rounded-sm"
                style={{ background: allocation.color }}
              />
              <span className="text-text">{allocation.channel}</span>
              <span className="text-right font-mono text-text-muted tnum">
                {allocation.pct}%
              </span>
              <span className="text-right font-mono text-text-muted tnum">
                <MoneyDisplay amount={allocation.spend} size="sm" />
              </span>
              <span className="text-right font-mono text-success tnum">
                {allocation.roas.toFixed(1)}×
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <h3 className="mb-1 text-[15px] font-semibold text-text">
          Audiences
        </h3>
        <p className="mb-4 text-xs text-text-subtle">
          SolAI tested 7 audiences. These {audiences.length} are active.
        </p>
        <div className="flex flex-col gap-2">
          {audiences.map((audience) => {
            const statusStyle = audienceStatusStyles[audience.status];
            return (
              <div
                key={audience.name}
                className="flex items-center justify-between rounded-md border border-border bg-bg px-3 py-3"
              >
                <div>
                  <strong className="block text-sm text-text">
                    {audience.name}
                  </strong>
                  <span className="font-mono text-xs text-text-subtle">
                    {audience.size} matches · CPA{" "}
                    <MoneyDisplay amount={audience.cpa} size="sm" />
                  </span>
                </div>
                <span
                  className="rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase"
                  style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                  }}
                >
                  {audience.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="col-span-full rounded-lg border border-border bg-surface p-5">
        <h3 className="mb-4 text-[15px] font-semibold text-text">
          Recent agent actions
        </h3>
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {agentActions.map((action) => (
            <li
              key={`${action.time}-${action.action}`}
              className="grid grid-cols-[8px_90px_70px_1fr_auto] items-start gap-2.5 rounded-md border border-border bg-bg px-3 py-2.5 text-sm max-[700px]:grid-cols-1"
            >
              <span
                className="mt-1.5 size-1.5 rounded-full bg-brand"
                aria-hidden
              />
              <span className="pt-px text-[11px] font-semibold tracking-wide text-brand uppercase">
                {action.agent}
              </span>
              <span className="pt-px font-mono text-[11px] text-text-subtle">
                {action.time}
              </span>
              <span className="leading-relaxed text-text">{action.action}</span>
              {action.why ? (
                <WhyPopover decision={action.why} />
              ) : (
                <span />
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
