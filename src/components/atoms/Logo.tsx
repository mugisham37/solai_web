import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data/site";

interface LogoProps {
  className?: string;
  size?: number;
  asLink?: boolean;
}

export function Logo({ className, size = 28, asLink = true }: LogoProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[17px] font-bold text-text no-underline hover:no-underline",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden
      >
        <circle
          cx="14"
          cy="14"
          r="12"
          stroke="var(--brand)"
          strokeWidth="2"
        />
        <circle cx="14" cy="14" r="5" fill="var(--brand)" />
      </svg>
      <span>{siteConfig.name}</span>
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" className="no-underline hover:no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
