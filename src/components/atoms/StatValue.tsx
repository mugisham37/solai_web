import { cn } from "@/lib/utils";

interface StatValueProps {
  value: string;
  label: string;
  className?: string;
}

export function StatValue({ value, label, className }: StatValueProps) {
  return (
    <div className={cn("text-center", className)}>
      <span className="tnum block font-mono text-[clamp(28px,4vw,40px)] font-semibold text-text">
        {value}
      </span>
      <span className="mt-1 block text-[13px] text-text-subtle">{label}</span>
    </div>
  );
}
