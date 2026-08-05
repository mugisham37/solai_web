import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number;
  done?: boolean;
  label?: string;
  className?: string;
  heightClass?: string;
};

export function ProgressBar({
  value,
  done,
  label,
  className,
  heightClass = "h-1.5",
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("overflow-hidden rounded-pill bg-paper-2", heightClass, className)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span
        className={cn(
          "block h-full transition-[width] duration-300 ease-linear",
          done ? "bg-sea" : "bg-sun",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
