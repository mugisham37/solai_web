import type { AutosaveStatus } from "@/types/build";
import { cn } from "@/lib/cn";

type AutosaveIndicatorProps = {
  status: AutosaveStatus;
  savedLabel: string;
  savingLabel: string;
  offlineLabel: string;
  onDark?: boolean;
  className?: string;
};

export function AutosaveIndicator({
  status,
  savedLabel,
  savingLabel,
  offlineLabel,
  onDark,
  className,
}: AutosaveIndicatorProps) {
  const label =
    status === "saving" ? savingLabel : status === "offline" ? offlineLabel : savedLabel;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs",
        onDark ? "text-on-deep-30" : "text-ink-45",
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "saved" && "bg-sea",
          status === "saving" && "animate-pulse bg-sun",
          status === "offline" && "bg-ink-45",
        )}
      />
      {label}
    </span>
  );
}
