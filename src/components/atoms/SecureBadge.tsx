import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";

type SecureBadgeProps = {
  label: string;
  className?: string;
};

/** Top-bar trust chip — “Protected by SolAI” / paying copy. */
export function SecureBadge({ label, className }: SecureBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[0.72rem] font-bold text-sea-muted",
        className,
      )}
    >
      <Icon name="lock" size="sm" className="size-3.5" />
      {label}
    </span>
  );
}
