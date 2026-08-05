import { cn } from "@/lib/cn";
import { iconMap } from "@/lib/icon-map";
import type { IconName } from "@/types/icon";

type IconProps = {
  name: IconName;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const sizeMap = {
  sm: "size-4",
  md: "size-[18px]",
  lg: "size-5",
} as const;

export function Icon({ name, size = "md", label, className }: IconProps) {
  const Comp = iconMap[name];
  return (
    <Comp
      className={cn("shrink-0 stroke-[1.7]", sizeMap[size], className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}
