import { cn } from "@/lib/utils";

interface LogoChipProps {
  label: string;
  className?: string;
}

export function LogoChip({ label, className }: LogoChipProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface px-5 py-2 text-[13px] font-medium text-text-muted",
        className,
      )}
    >
      {label}
    </div>
  );
}
