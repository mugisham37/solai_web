import type { Kpi } from "@/types/app";
import { Sparkline } from "@/components/atoms/app/Sparkline";
import { DeltaBadge } from "@/components/atoms/app/DeltaBadge";
import { WhyPopover } from "@/components/molecules/app/WhyPopover";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  kpi: Kpi;
  className?: string;
}

export function KpiCard({ kpi, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-surface p-4 transition-colors hover:border-text-subtle/50",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-text-subtle uppercase">
          {kpi.label}
        </span>
        <WhyPopover decision={kpi.why} title="Why this number?" />
      </div>
      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tnum">{kpi.value}</span>
        <DeltaBadge value={kpi.delta} up={kpi.up} />
      </div>
      <Sparkline data={kpi.spark} up={kpi.up} className="mb-1" />
      <span className="text-xs text-text-muted">{kpi.sub}</span>
    </div>
  );
}
