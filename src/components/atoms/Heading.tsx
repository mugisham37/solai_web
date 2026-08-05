import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeadingScale = "display" | "h2" | "h3" | "h4";

type HeadingProps = {
  level: 1 | 2 | 3 | 4;
  size: HeadingScale;
  surface?: "light" | "dark";
  className?: string;
  children: ReactNode;
};

const scaleClass: Record<HeadingScale, string> = {
  display: "text-display",
  h2: "text-heading-2",
  h3: "text-heading-3",
  h4: "text-[0.96rem] font-bold leading-snug",
};

export function Heading({ level, size, surface = "light", className, children }: HeadingProps) {
  const classes = cn(
    scaleClass[size],
    size !== "h4" && "font-display uppercase",
    surface === "dark" && "text-on-deep",
    surface === "light" && "text-ink",
    className,
  );

  switch (level) {
    case 1:
      return <h1 className={classes}>{children}</h1>;
    case 2:
      return <h2 className={classes}>{children}</h2>;
    case 3:
      return <h3 className={classes}>{children}</h3>;
    case 4:
      return <h4 className={classes}>{children}</h4>;
    default:
      return <h2 className={classes}>{children}</h2>;
  }
}
