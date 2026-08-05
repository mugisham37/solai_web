import { BeadedBracelet } from "@/components/art/BeadedBracelet";
import { cn } from "@/lib/cn";

type ProductThumbProps = {
  palette: number;
  beadCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  gradientId: string;
};

const sizeClass = {
  sm: "size-[52px] rounded-[11px]",
  md: "size-[76px] rounded-[14px]",
  lg: "aspect-square w-full rounded-xl",
} as const;

/** Placeholder product art until real images are attached — reuses BeadedBracelet. */
export function ProductThumb({
  palette,
  beadCount = 12,
  size = "sm",
  className,
  gradientId,
}: ProductThumbProps) {
  return (
    <div className={cn("shrink-0 overflow-hidden bg-paper-2", sizeClass[size], className)}>
      <BeadedBracelet
        paletteIndex={palette}
        beadCount={beadCount}
        gradientId={gradientId}
        aspectClass="aspect-square"
        className="size-full rounded-none"
      />
    </div>
  );
}
