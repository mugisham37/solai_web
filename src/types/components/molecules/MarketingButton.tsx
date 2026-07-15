import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketingButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "cta" | "secondary";
  size?: "default" | "lg";
  className?: string;
}

export function MarketingButton({
  href,
  children,
  variant = "cta",
  size = "default",
  className,
}: MarketingButtonProps) {
  return (
    <Button
      asChild
      variant={variant === "cta" ? "cta" : "secondary"}
      size={size === "lg" ? "lg" : "default"}
      className={cn("no-underline hover:no-underline", className)}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
