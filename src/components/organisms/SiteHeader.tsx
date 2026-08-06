"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/atoms/Logo";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher";
import { NavLink } from "@/components/molecules/NavLink";
import {
  Sheet,
  SheetClose,
  SheetContent,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import type { NavItem } from "@/types/landing";
import { cn } from "@/lib/cn";

type SiteHeaderProps = {
  nav: readonly NavItem[];
  labels: Record<string, string>;
  startFreeLabel: string;
  languageLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  mainNavLabel: string;
  mobileNavLabel: string;
};

export function SiteHeader({
  nav,
  labels,
  startFreeLabel,
  languageLabel,
  openMenuLabel,
  closeMenuLabel,
  mainNavLabel,
  mobileNavLabel,
}: SiteHeaderProps) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        id="hdr"
        className={cn(
          "sticky top-0 z-40 transition-[background,box-shadow,padding] duration-300 ease-[var(--ease-standard)]",
          stuck && "bg-deep/90 shadow-[0_1px_0_var(--color-deep-hair)] backdrop-blur-xl",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1180px] items-center gap-3.5 px-[1.15rem] py-3.5 md:px-8",
            stuck && "py-2",
          )}
        >
          <Logo href="#top" />
          <nav className="ml-5 hidden gap-5 lg:flex" aria-label={mainNavLabel}>
            {nav.map((item) => (
              <NavLink key={item.id} href={item.href}>
                {labels[item.labelKey] ?? item.labelKey}
              </NavLink>
            ))}
          </nav>
          <span className="flex-1" />
          <LanguageSwitcher ariaLabel={languageLabel} />
          <ActionButton asChild variant="sun" size="sm" className="hidden md:inline-flex">
            <Link href="#start">{startFreeLabel}</Link>
          </ActionButton>
          <button
            ref={burgerRef}
            type="button"
            className="grid size-10 place-items-center rounded-[11px] border border-deep-hair text-on-deep lg:hidden"
            aria-label={openMenuLabel}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent aria-label={mobileNavLabel}>
          <div className="mb-4 flex items-center justify-between">
            <Logo href="#top" />
            <SheetClose asChild>
              <button
                type="button"
                className="grid size-10 place-items-center rounded-[11px] border border-deep-hair"
                aria-label={closeMenuLabel}
                onClick={() => {
                  setOpen(false);
                  burgerRef.current?.focus();
                }}
              >
                <Icon name="x" />
              </button>
            </SheetClose>
          </div>
          {nav.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="border-b border-deep-hair py-3.5 font-display text-2xl font-extrabold uppercase text-on-deep"
              onClick={() => setOpen(false)}
            >
              {labels[item.labelKey] ?? item.labelKey}
            </Link>
          ))}
          <ActionButton asChild variant="sun" size="lg" block className="mt-5">
            <Link href="#start" onClick={() => setOpen(false)}>
              {startFreeLabel}
            </Link>
          </ActionButton>
        </SheetContent>
      </Sheet>
    </>
  );
}
