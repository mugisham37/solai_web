import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/lib/utils";
import type { NavLink as NavLinkData } from "@/types/marketing";

interface NavLinkProps {
  link: NavLinkData;
  isActive?: boolean;
  variant?: "pill" | "plain";
  className?: string;
  onClick?: () => void;
}

const VARIANT_CLASSES: Record<"pill" | "plain", string> = {
  pill: "rounded-md px-3.5 py-1.5 text-sm font-medium text-text-muted transition-colors duration-150 ease-brand hover:bg-surface-2 hover:text-text",
  plain:
    "text-[13px] text-text-muted transition-colors duration-150 ease-brand hover:text-text",
};

export function NavLink({
  link,
  isActive,
  variant = "pill",
  className,
  onClick,
}: NavLinkProps) {
  const sharedClassName = cn(
    VARIANT_CLASSES[variant],
    isActive && variant === "pill" && "bg-surface-2 text-text",
    className,
  );

  if (link.isImplemented) {
    return (
      <Link href={link.href as Route} className={sharedClassName} onClick={onClick}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href="#" className={sharedClassName} onClick={onClick}>
      {link.label}
    </a>
  );
}
