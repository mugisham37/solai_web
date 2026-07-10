"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { CtaButtonLink } from "@/components/atoms/cta-button-link";
import { Logo } from "@/components/atoms/logo";
import { NavLink } from "@/components/atoms/nav-link";
import { ThemeToggleButton } from "@/components/atoms/theme-toggle-button";
import { MobileNavPanel } from "@/components/molecules/mobile-nav-panel";
import { Button } from "@/components/ui/button";
import { HERO_CONTENT } from "@/data/marketing/hero";
import { LOGIN_LINK, NAV_LINKS } from "@/data/marketing/nav-links";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeHref = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--nav-bg-translucent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-6 px-4 sm:px-8">
        <Link href="/" aria-label="SolAI home">
          <Logo />
        </Link>

        <nav className="ml-8 hidden gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} link={link} isActive={link.href === activeHref} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggleButton />
          <NavLink
            link={LOGIN_LINK}
            variant="plain"
            className="hidden lg:inline-block"
          />
          <CtaButtonLink cta={HERO_CONTENT.primaryCta} variant="cta" />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      <MobileNavPanel
        isOpen={mobileOpen}
        links={NAV_LINKS}
        activeHref={activeHref}
        onNavigate={() => setMobileOpen(false)}
      />
    </header>
  );
}
