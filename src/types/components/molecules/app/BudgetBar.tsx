import { cn } from "@/lib/utils";

interface BudgetBarProps {
  spend: number;
  cap: number;
  className?: string;
}

export function BudgetBar({ spend, cap, className }: BudgetBarProps) {
  const pct = Math.min((spend / cap) * 100, 100);
  let tone = "bg-brand";
  if (pct >= 95) tone = "bg-danger";
  else if (pct >= 80) tone = "bg-warning";

  return (
    <div
      className={cn(
        "h-1 w-full overflow-hidden rounded-pill bg-surface-2",
        className
      )}
    >
      <div
        className={cn("h-full rounded-pill transition-all duration-300", tone)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

interface UsageBarProps {
  used: number;
  max: number;
  className?: string;
}

export function UsageBar({ used, max, className }: UsageBarProps) {
  const pct = Math.min((used / max) * 100, 100);
  let tone = "bg-success";
  if (pct >= 85) tone = "bg-danger";
  else if (pct >= 65) tone = "bg-warning";

  return (
    <div className={cn("space-y-1", className)}>
      <div className="h-2 w-full overflow-hidden rounded-pill bg-surface-2">
        <div
          className={cn("h-full rounded-pill transition-all duration-300", tone)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
