"use client";

import { Link } from "@/i18n/navigation";
import { CountBadge } from "@/components/atoms/CountBadge";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";

type NavItemProps = {
  href: string;
  label: string;
  icon: IconName;
  active: boolean;
  badgeCount?: number;
  className?: string;
};

/** Sidebar nav row. Active styles sit on top of the shared sliding pill. */
export function NavItem({
  href,
  label,
  icon,
  active,
  badgeCount = 0,
  className,
}: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-nav-item
      data-active={active ? "true" : undefined}
      className={cn(
        "relative z-[1] flex min-h-11 w-full items-center gap-2.5 rounded-[11px] px-2.5 py-2.5 text-left text-[0.9rem] font-semibold transition-colors duration-[180ms] ease-[var(--ease-standard)]",
        active ? "text-on-deep" : "text-ink-70 hover:text-ink",
        className,
      )}
    >
      <Icon
        name={icon}
        size="md"
        className={cn(
          "size-[19px] transition-transform duration-200 ease-[var(--ease-standard)]",
          active ? "text-sun" : "group-hover:translate-x-px",
        )}
      />
      <span className="min-w-0 truncate">{label}</span>
      <CountBadge count={badgeCount} />
    </Link>
  );
}
