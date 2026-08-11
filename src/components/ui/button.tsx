import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill border border-transparent text-sm font-bold leading-none transition-[transform,filter,background] duration-[var(--duration-state)] ease-[var(--ease-standard)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        sun: "bg-sun text-sun-ink shadow-sun hover:brightness-105",
        deep: "bg-deep text-on-deep",
        line: "border-ink-20 bg-transparent hover:bg-paper-2",
        whatsapp: "bg-whatsapp text-white",
        plain: "bg-transparent hover:bg-paper-2",
        clay: "bg-clay text-white",
        sea: "bg-sea text-white",
      },
      size: {
        sm: "min-h-11 px-3.5 py-2 text-[0.82rem]",
        default: "px-5 py-3 text-[0.92rem]",
        lg: "px-6 py-4 text-base",
      },
      block: {
        true: "w-full",
        false: "",
      },
      onDark: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "line",
        onDark: true,
        className: "border-deep-hair text-on-deep hover:bg-white/10",
      },
    ],
    defaultVariants: {
      variant: "sun",
      size: "default",
      block: false,
      onDark: false,
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, onDark, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, block, onDark, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
