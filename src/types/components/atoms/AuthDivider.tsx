import { cn } from "@/lib/utils";

interface AuthDividerProps {
  text?: string;
  className?: string;
}

export function AuthDivider({ text = "or", className }: AuthDividerProps) {
  return (
    <div
      className={cn(
        "relative my-1 flex items-center gap-3 text-xs text-text-subtle before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
        className,
      )}
    >
      <span className="shrink-0 px-1">{text}</span>
    </div>
  );
}
