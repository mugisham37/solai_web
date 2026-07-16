import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RailBadgeGroupProps {
  rails: string[];
  className?: string;
}

export function RailBadgeGroup({ rails, className }: RailBadgeGroupProps) {
  return (
    <div className={cn("mt-3 flex flex-wrap gap-1.5", className)}>
      {rails.map((rail) => (
        <Badge
          key={rail}
          variant="outline"
          className="rounded-sm border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-text-muted"
        >
          {rail}
        </Badge>
      ))}
    </div>
  );
}
