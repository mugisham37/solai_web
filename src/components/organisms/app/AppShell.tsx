"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Notification, WorkspaceInfo } from "@/types/app";
import { appNavItems } from "@/lib/data/app/nav";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { CommandPalette } from "./CommandPalette";
import { NotificationsDrawer } from "./NotificationsDrawer";

interface AppShellProps {
  children: React.ReactNode;
  workspace: WorkspaceInfo;
  notifications: Notification[];
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/settings")) {
    const segment = pathname.split("/")[2] ?? "profile";
    const labels: Record<string, string> = {
      profile: "Profile",
      team: "Team & roles",
      permissions: "Agent permissions",
      integrations: "Integrations",
      billing: "Billing & usage",
      audit: "Audit log",
    };
    return `Settings · ${labels[segment] ?? "Settings"}`;
  }

  const match = appNavItems.find((item) => {
    if (item.href === "/dashboard") return pathname === "/dashboard";
    if (item.href.startsWith("/settings"))
      return pathname.startsWith("/settings");
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });

  if (match?.id === "conversations") {
    if (pathname.includes("/compose")) return "Compose message";
    if (pathname.includes("/templates")) return "Templates";
    if (pathname.includes("/quarantine")) return "Quarantine";
    return "Conversations";
  }

  if (match?.id === "campaigns" && pathname.includes("/campaigns/")) {
    return "Campaign detail";
  }

  return match?.label ?? "Dashboard";
}

export function AppShell({
  children,
  workspace,
  notifications,
}: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("solai-sidebar-collapsed") === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const title = useMemo(() => getPageTitle(pathname), [pathname]);
  const actionNotifs = notifications.filter(
    (n) => n.type === "warning" || n.type === "danger"
  );

  useEffect(() => {
    localStorage.setItem("solai-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-bg">
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
        workspace={workspace}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          title={title}
          notifCount={actionNotifs.length}
          onMenuToggle={() => setMobileOpen(true)}
          onNotifications={() => setNotifOpen(true)}
          onSearch={() => setPaletteOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
      <NotificationsDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
      />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={closeMobile}
      />
    </div>
  );
}
