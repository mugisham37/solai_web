import { ShimmerBlock } from "@/components/atoms/ShimmerBlock";

export function StorefrontSkeleton() {
  return (
    <div className="build-app-shell mx-auto min-h-screen max-w-[1240px] bg-paper">
      <div className="flex items-center gap-3 border-b border-hair px-4 py-3">
        <ShimmerBlock className="size-6 rounded-lg" />
        <ShimmerBlock className="h-4 w-28" />
        <span className="flex-1" />
        <ShimmerBlock className="size-[38px] rounded-full" />
      </div>
      <div className="grid gap-5 p-4 md:grid-cols-2">
        <ShimmerBlock className="aspect-square rounded-card" />
        <div className="flex flex-col gap-3">
          <ShimmerBlock className="h-3 w-32" />
          <ShimmerBlock className="h-10 w-full" />
          <ShimmerBlock className="h-6 w-40" />
          <ShimmerBlock className="h-24 w-full rounded-card" />
          <ShimmerBlock className="h-32 w-full rounded-card" />
        </div>
      </div>
    </div>
  );
}
