import { Skeleton } from "@/components/atoms/Skeleton";
import { cn } from "@/lib/cn";

type DashboardSkeletonProps = {
  variant?: "home" | "list" | "detail";
  className?: string;
};

/** Shape-matched loading state for dashboard routes — never a centred spinner. */
export function DashboardSkeleton({
  variant = "list",
  className,
}: DashboardSkeletonProps) {
  if (variant === "home") {
    return (
      <div className={cn("flex flex-col gap-4", className)} aria-hidden>
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid grid-cols-2 gap-3 @[700px]:grid-cols-4">
          <Skeleton className="h-[72px]" />
          <Skeleton className="h-[72px]" />
          <Skeleton className="h-[72px]" />
          <Skeleton className="h-[72px]" />
        </div>
        <Skeleton className="h-52" />
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("flex flex-col gap-4", className)} aria-hidden>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-36" />
        <Skeleton className="h-24" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)} aria-hidden>
      <Skeleton className="h-8 w-36" />
      <div className="flex gap-2 overflow-hidden">
        <Skeleton className="h-9 w-20 shrink-0 rounded-pill" />
        <Skeleton className="h-9 w-24 shrink-0 rounded-pill" />
        <Skeleton className="h-9 w-24 shrink-0 rounded-pill" />
      </div>
      <Skeleton className="h-[72px]" />
      <Skeleton className="h-[72px]" />
      <Skeleton className="h-[72px]" />
      <Skeleton className="h-[72px]" />
    </div>
  );
}
