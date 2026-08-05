import type { PriceConfidence } from "@/types/build";
import { cn } from "@/lib/cn";

type ConfidencePipsProps = {
  level: PriceConfidence;
  label: string;
  className?: string;
};

export function ConfidencePips({ level, label, className }: ConfidencePipsProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-bold",
        level === "high" && "text-sea-muted",
        level === "medium" && "text-berry-muted",
        level === "low" && "text-clay",
        className,
      )}
      title={label}
    >
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <i
            key={i}
            className={cn(
              "block h-1 w-3.5 rounded-sm bg-ink-20",
              level === "high" && "bg-sea",
              level === "medium" && i < 2 && "bg-berry",
              level === "low" && i < 1 && "bg-clay",
            )}
          />
        ))}
      </span>
      <span>{label}</span>
    </span>
  );
}
