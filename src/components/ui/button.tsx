import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-semibold outline-none transition-colors duration-150 ease-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        cta: "border border-brand bg-brand text-white hover:bg-[#4A6BEE]",
        secondary:
          "border border-border bg-transparent text-text hover:border-text-subtle hover:bg-surface-2",
        ghost:
          "border border-transparent bg-transparent text-text-muted hover:bg-surface-2 hover:text-text",
        subtle:
          "border border-transparent bg-transparent text-brand hover:bg-brand-soft",
      },
      size: {
        default: "h-10 px-[22px]",
        sm: "h-auto rounded px-2 py-[3px] text-xs font-medium",
        lg: "h-13 px-7 text-[15px]",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "cta",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
