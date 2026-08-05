import { cn } from "@/lib/cn";

type CountBadgeProps = {
  count: number;
  className?: string;
};

/** Count pill for navigation. Hidden at zero so a quiet shop stays quiet. */
export function CountBadge({ count, className }: CountBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "ml-auto grid min-w-5 place-items-center rounded-pill bg-sun px-1.5 text-[0.68rem] font-extrabold text-sun-ink",
        className,
      )}
    >
      {count}
    </span>
  );
}
