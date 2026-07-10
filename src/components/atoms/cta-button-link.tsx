import Link from "next/link";
import type { Route } from "next";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CtaLink } from "@/types/marketing";

interface CtaButtonLinkProps extends VariantProps<typeof buttonVariants> {
  cta: CtaLink;
  className?: string;
}

export function CtaButtonLink({ cta, variant, size, className }: CtaButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (cta.isImplemented) {
    return (
      <Link href={cta.href as Route} className={classes}>
        {cta.label}
      </Link>
    );
  }

  return (
    <a href="#" className={classes}>
      {cta.label}
    </a>
  );
}
