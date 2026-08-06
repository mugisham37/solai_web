import { Skeleton } from "@/components/atoms/Skeleton";

export default function OrderLoading() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-bg px-5 py-8">
      <Skeleton className="mb-6 h-10 w-full rounded-xl" />
      <Skeleton className="mb-4 h-8 w-2/3" />
      <Skeleton className="mb-8 h-16 w-full rounded-2xl" />
      <Skeleton className="mb-4 h-28 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  );
}
