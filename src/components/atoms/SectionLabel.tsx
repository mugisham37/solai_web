import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "mb-3 font-mono text-xs font-medium tracking-[0.08em] text-brand uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
