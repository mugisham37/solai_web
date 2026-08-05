import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type IconTileVariant = "neutral" | "sun" | "deep" | "berry" | "sea" | "clay";

type IconTileProps = {
  variant?: IconTileVariant;
  children: ReactNode;
  className?: string;
};

const variants: Record<IconTileVariant, string> = {
  neutral: "bg-paper-2 text-ink",
  sun: "bg-sun text-sun-ink",
  deep: "bg-deep text-on-deep",
  berry: "bg-berry/15 text-berry-muted",
  sea: "bg-sea/20 text-sea-muted",
  clay: "bg-clay/10 text-clay",
};

export function IconTile({ variant = "neutral", children, className }: IconTileProps) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
