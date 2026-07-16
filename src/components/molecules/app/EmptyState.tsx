import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-soft">
        <Icon className="size-6 text-brand" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-text">{title}</h2>
      <p className="mb-6 max-w-md text-sm text-text-muted">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && actionHref && (
          <Button asChild variant="cta">
            <a href={actionHref}>{actionLabel}</a>
          </Button>
        )}
        {secondaryLabel && secondaryHref && (
          <Button asChild variant="secondary">
            <a href={secondaryHref}>{secondaryLabel}</a>
          </Button>
        )}
      </div>
    </div>
  );
}
