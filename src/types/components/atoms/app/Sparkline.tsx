import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  up?: boolean;
  className?: string;
}

export function Sparkline({ data, up = true, className }: SparklineProps) {
  if (data.length < 2) return null;

  const points = data
    .map((v, i) => `${i * (120 / (data.length - 1))},${v}`)
    .join(" ");

  return (
    <svg
      className={cn("h-8 w-full", className)}
      viewBox="0 0 120 32"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={up ? "var(--success)" : "var(--danger)"}
        strokeWidth="1.5"
      />
    </svg>
  );
}
