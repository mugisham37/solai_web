"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/atoms/Logo";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { NavLink } from "@/components/molecules/NavLink";
import { MarketingButton } from "@/components/molecules/MarketingButton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/data/nav";

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-6 px-4 md:px-8">
        <Logo />

        <nav className="ml-8 hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-medium text-text-muted no-underline hover:text-text hover:no-underline"
          >
            Log in
          </Link>
          <MarketingButton href="/signup" variant="cta">
            Start free
          </MarketingButton>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto md:hidden"
            >
              {open ? (
                <X className="size-5 text-text" />
              ) : (
                <Menu className="size-5 text-text" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-full max-w-sm flex-col border-border bg-surface p-0"
          >
            <SheetHeader className="border-b border-border px-6 py-4">
              <SheetTitle className="text-left text-text">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5"
                />
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3 border-t border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Theme</span>
                <ThemeToggle />
              </div>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-center text-sm font-medium text-text-muted no-underline hover:text-text"
              >
                Log in
              </Link>
              <MarketingButton
                href="/signup"
                variant="cta"
                className="w-full justify-center"
              >
                Start free
              </MarketingButton>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
