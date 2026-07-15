"use client";

import { Bell, Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";

interface AppTopbarProps {
  title: string;
  notifCount: number;
  onMenuToggle: () => void;
  onNotifications: () => void;
  onSearch: () => void;
}

export function AppTopbar({
  title,
  notifCount,
  onMenuToggle,
  onNotifications,
  onSearch,
}: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-bg/95 px-4 backdrop-blur-sm md:px-6">
      <button
        type="button"
        onClick={onMenuToggle}
        className="inline-flex rounded-md p-2 text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-text md:text-lg">
        {title}
      </h1>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onSearch}
          className="inline-flex size-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Search"
          title="⌘K"
        >
          <Search className="size-[18px]" strokeWidth={1.5} />
        </button>
        <ThemeToggle />
        <button
          type="button"
          onClick={onNotifications}
          className="relative inline-flex size-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" strokeWidth={1.5} />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-medium text-white">
              {notifCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
