import { cn } from "@/lib/cn";

type EyebrowProps = {
  children: React.ReactNode;
  variant?: "accent" | "quiet";
  onDark?: boolean;
  className?: string;
};

export function Eyebrow({
  children,
  variant = "accent",
  onDark = false,
  className,
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-eyebrow m-0",
        variant === "accent" && !onDark && "text-sun-deep",
        variant === "accent" && onDark && "text-sun",
        variant === "quiet" && "text-ink-45",
        className,
      )}
    >
      {children}
    </p>
  );
}
