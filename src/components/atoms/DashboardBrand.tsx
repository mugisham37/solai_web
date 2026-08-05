import { Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type DashboardBrandProps = {
  className?: string;
};

/** Locale-aware SolAI mark for the dashboard shell. */
export function DashboardBrand({ className }: DashboardBrandProps) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "inline-flex items-center gap-2 font-display text-base font-extrabold tracking-tight text-ink uppercase",
        className,
      )}
    >
      <span className="grid size-6 place-items-center rounded-[9px] bg-sun text-sun-ink">
        <Zap className="size-3.5" strokeWidth={1.7} aria-hidden />
      </span>
      <span>
        Sol<span className="text-sun-deep">AI</span>
      </span>
    </Link>
  );
}
