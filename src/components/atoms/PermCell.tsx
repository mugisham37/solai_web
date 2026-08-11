import { cn } from "@/lib/cn";

type PermCellProps = {
  allowed: boolean;
  className?: string;
};

export function PermCell({ allowed, className }: PermCellProps) {
  return (
    <span
      className={cn(
        "grid place-items-center text-sm font-bold",
        allowed ? "text-sea-muted" : "text-ink-20",
        className,
      )}
      aria-label={allowed ? "Allowed" : "Not allowed"}
    >
      {allowed ? "✓" : "—"}
    </span>
  );
}
