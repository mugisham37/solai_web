import { cn } from "@/lib/cn";

type ProgressMeterProps = {
  value: number;
  max: number;
  label: string;
  /** Spoken instead of a bare percentage: "3 of 5" is the useful reading. */
  valueText: string;
  className?: string;
};

/**
 * Counts discrete things done out of a known total, which is why it reports
 * `aria-valuenow` in items rather than the 0-100 percentage `ProgressBar` uses.
 */
export function ProgressMeter({ value, max, label, valueText, className }: ProgressMeterProps) {
  const safeMax = Math.max(1, max);
  const clamped = Math.max(0, Math.min(safeMax, value));
  const pct = (clamped / safeMax) * 100;

  return (
    <div
      className={cn("h-1.5 overflow-hidden rounded-pill bg-paper-2", className)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuetext={valueText}
    >
      <span
        className="block h-full bg-sea transition-[width] duration-300 ease-[var(--ease-standard)] motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
