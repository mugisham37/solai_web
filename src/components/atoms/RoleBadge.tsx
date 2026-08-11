import { cn } from "@/lib/cn";
import type { ConsoleRole } from "@/types/console";

const ROLE_LABEL: Record<ConsoleRole, string> = {
  support: "Support",
  finance: "Finance",
  admin: "Admin",
};

type RoleBadgeProps = {
  role: ConsoleRole;
  className?: string;
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill bg-mauve/20 px-2 py-0.5 text-[0.68rem] font-bold text-[#5E4478]",
        className,
      )}
    >
      {ROLE_LABEL[role]}
    </span>
  );
}
