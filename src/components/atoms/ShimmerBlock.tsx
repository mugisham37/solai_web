import { cn } from "@/lib/cn";

type ShimmerBlockProps = {
  className?: string;
  aspectRatio?: string;
};

export function ShimmerBlock({ className, aspectRatio }: ShimmerBlockProps) {
  return (
    <div
      className={cn("shimmer-sweep rounded-tile", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
      aria-hidden
    />
  );
}
