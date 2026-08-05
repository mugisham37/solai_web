import { cn } from "@/lib/cn";

type TextProps = {
  size?: "body-large" | "body" | "small" | "tiny";
  surface?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
};

const sizeClass = {
  "body-large": "text-body-large",
  body: "text-base leading-[1.55]",
  small: "text-[0.88rem] leading-normal text-ink-70",
  tiny: "text-[0.76rem] leading-snug text-ink-45",
} as const;

export function Text({ size = "body", surface = "light", className, children }: TextProps) {
  return (
    <p
      className={cn(
        "m-0",
        sizeClass[size],
        surface === "dark" && size === "body-large" && "text-on-deep-60",
        surface === "dark" && size === "small" && "text-on-deep-60",
        surface === "dark" && size === "tiny" && "text-on-deep-30",
        surface === "dark" && size === "body" && "text-on-deep",
        className,
      )}
    >
      {children}
    </p>
  );
}
