import { Skeleton } from "@/components/atoms/Skeleton";
import { cn } from "@/lib/cn";

type ConsoleSkeletonProps = {
  variant?: "home" | "list" | "detail";
  className?: string;
};

export function ConsoleSkeleton({
  variant = "home",
  className,
}: ConsoleSkeletonProps) {
  if (variant === "list") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <Skeleton className="h-8 w-2/5" />
        <div className="flex gap-2">
          <Skeleton className="h-11 w-24 rounded-pill" />
          <Skeleton className="h-11 w-28 rounded-pill" />
          <Skeleton className="h-11 w-24 rounded-pill" />
        </div>
        <Skeleton className="h-64 w-full rounded-card" />
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-4 @[1000px]:grid-cols-[1fr_0.82fr]">
          <Skeleton className="h-80 w-full rounded-card" />
          <Skeleton className="h-64 w-full rounded-card" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Skeleton className="h-16 w-full rounded-card" />
      <div className="grid grid-cols-2 gap-2.5 @[700px]:grid-cols-4">
        <Skeleton className="h-[78px] rounded-card" />
        <Skeleton className="h-[78px] rounded-card" />
        <Skeleton className="h-[78px] rounded-card" />
        <Skeleton className="h-[78px] rounded-card" />
      </div>
      <Skeleton className="h-56 w-full rounded-card" />
    </div>
  );
}
