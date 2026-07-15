import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComplianceBadgeGroupProps {
  badges: readonly string[];
  className?: string;
}

export function ComplianceBadgeGroup({
  badges,
  className,
}: ComplianceBadgeGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((badge) => (
        <Badge
          key={badge}
          variant="outline"
          className="rounded border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.04em] text-text-subtle uppercase"
        >
          {badge}
        </Badge>
      ))}
    </div>
  );
}
