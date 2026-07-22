"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  LogOut,
  MessageCircle,
  PieChart,
  Settings,
  Shield,
  ShoppingBag,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WorkspaceInfo } from "@/types/app";
import { appNavItems } from "@/lib/data/app/nav";
import * as authService from "@/lib/api/services/auth";
import { useSession } from "@/providers/session-provider";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Home,
  Target,
  MessageCircle,
  ShoppingBag,
  Clock,
  Shield,
  PieChart,
  Settings,
  BarChart3,
};

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  workspace: WorkspaceInfo;
}

export function AppSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
  workspace,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { clearSession } = useSession();

  async function handleSignOut() {
    await authService.logout();
    clearSession();
    router.push("/login");
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href.startsWith("/settings")) return pathname.startsWith("/settings");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[99] bg-black/50 md:hidden"
          onClick={onMobileClose}
          aria-label="Close menu"
        />
      )}
      <aside
        className={cn(
          "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200",
          collapsed ? "w-16" : "w-60",
          "max-md:fixed max-md:z-[100] max-md:h-full max-md:transition-transform",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-3">
          <Link href="/dashboard" className={cn("text-sm no-underline hover:no-underline", collapsed && "max-md:flex md:hidden")}>
            <span className="inline-flex items-center gap-2 text-[17px] font-bold text-text">
              <svg width={24} height={24} viewBox="0 0 28 28" fill="none" aria-hidden>
                <circle cx="14" cy="14" r="12" stroke="var(--brand)" strokeWidth="2" />
                <circle cx="14" cy="14" r="5" fill="var(--brand)" />
              </svg>
              <span className={cn(collapsed && "hidden md:inline")}>SolAI</span>
            </span>
          </Link>
          {collapsed ? (
            <Link
              href="/dashboard"
              className="hidden items-center justify-center md:flex"
              aria-label="SolAI home"
            >
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden>
                <circle cx="14" cy="14" r="12" stroke="var(--brand)" strokeWidth="2" />
                <circle cx="14" cy="14" r="5" fill="var(--brand)" />
              </svg>
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onToggle}
            className="hidden rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:inline-flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {appNavItems.map((item) => {
            const Icon = iconMap[item.icon] ?? Home;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onMobileClose}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  active
                    ? "bg-brand-soft text-brand"
                    : "text-text-muted hover:bg-surface-2 hover:text-text",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="size-[18px] shrink-0" strokeWidth={1.5} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-3 rounded-md bg-surface-2 p-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                {workspace.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">
                  {workspace.name}
                </p>
                <p className="truncate text-xs text-text-muted">
                  {workspace.plan} plan
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="size-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
