import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";

type LockbarProps = {
  children: React.ReactNode;
  icon?: IconName;
  className?: string;
};

/** Deep banner reinforcing a hard product rule. */
export function Lockbar({
  children,
  icon = "lock",
  className,
}: LockbarProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-card bg-deep px-3.5 py-3 text-[0.81rem] leading-snug text-on-deep-60",
        className,
      )}
    >
      <Icon name={icon} size="sm" className="mt-0.5 shrink-0 text-sun" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
