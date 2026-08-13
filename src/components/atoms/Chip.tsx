import { Badge } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type ChipProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Chip({ className, variant, onDark, ...props }: ChipProps) {
  return <Badge className={cn(className)} variant={variant} onDark={onDark} {...props} />;
}
