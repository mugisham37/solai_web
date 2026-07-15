import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaBadgeProps {
  value: string;
  up?: boolean;
  className?: string;
}

export function DeltaBadge({ value, up = true, className }: DeltaBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-mono text-xs font-medium tnum",
        up ? "text-success" : "text-danger",
        className
      )}
    >
      {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
      {value}
    </span>
  );
}
