import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.74rem] font-bold whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-paper-2 text-ink-70",
        sun: "bg-sun text-sun-ink",
        held: "bg-berry/15 text-berry-muted",
        live: "bg-sea/15 text-sea-muted before:size-1.5 before:rounded-full before:bg-sea before:content-[''] before:animate-pulse",
        line: "border border-ink-20 bg-transparent text-ink-70",
      },
      onDark: {
        true: "bg-white/10 text-on-deep",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      onDark: false,
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, onDark, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, onDark }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
