import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/cn";

type LogoProps = {
  size?: "sm" | "md";
  onDark?: boolean;
  href?: string;
  className?: string;
};

export function Logo({ size = "md", onDark = true, href = "#top", className }: LogoProps) {
  const markSize = size === "sm" ? "size-6" : "size-7";
  const textSize = size === "sm" ? "text-base" : "text-[1.1rem]";

  const body = (
    <>
      <span
        className={cn(
          "grid place-items-center rounded-[9px] bg-sun text-sun-ink",
          markSize,
        )}
      >
        <Zap className="size-4" strokeWidth={1.7} aria-hidden />
      </span>
      <span className={cn("font-display font-extrabold uppercase tracking-tight", textSize)}>
        Sol
        <span className={onDark ? "text-sun" : "text-sun-deep"}>AI</span>
      </span>
    </>
  );

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-display font-extrabold uppercase",
        onDark ? "text-on-deep" : "text-ink",
        className,
      )}
    >
      {body}
    </Link>
  );
}
