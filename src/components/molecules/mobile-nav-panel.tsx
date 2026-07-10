"use client";

import { NavLink } from "@/components/atoms/nav-link";
import { ExpandPanel } from "@/components/molecules/expand-panel";
import type { NavLink as NavLinkData } from "@/types/marketing";

interface MobileNavPanelProps {
  isOpen: boolean;
  links: NavLinkData[];
  activeHref: string;
  onNavigate: () => void;
}

export function MobileNavPanel({
  isOpen,
  links,
  activeHref,
  onNavigate,
}: MobileNavPanelProps) {
  return (
    <ExpandPanel
      isOpen={isOpen}
      id="mobile-nav-panel"
      className="border-b border-border bg-surface lg:hidden"
    >
      <nav className="flex flex-col gap-1 p-3" aria-label="Mobile">
        {links.map((link) => (
          <NavLink
            key={link.href}
            link={link}
            isActive={link.href === activeHref}
            onClick={onNavigate}
            className="w-full px-4 py-2.5"
          />
        ))}
      </nav>
    </ExpandPanel>
  );
}
