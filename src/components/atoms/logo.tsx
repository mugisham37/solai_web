import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
}

export function Logo({ className, iconSize = 28 }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[17px] font-bold text-text",
        className,
      )}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="14" cy="14" r="12" stroke="var(--brand)" strokeWidth="2" />
        <circle cx="14" cy="14" r="5" fill="var(--brand)" />
      </svg>
      SolAI
    </span>
  );
}
