import { cn } from "@/lib/cn";

type SkeletonProps = {
  className?: string;
};

/**
 * Shape block for route loading states. Shimmer is the only looping dashboard
 * animation; it stops under prefers-reduced-motion via globals.css.
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("shimmer-sweep rounded-tile", className)} aria-hidden />;
}
