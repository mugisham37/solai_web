"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { BottomNav } from "@/components/molecules/BottomNav";
import { SidebarNav } from "@/components/molecules/SidebarNav";
import { TopBar } from "@/components/molecules/TopBar";
import { AddProductFab } from "@/components/molecules/AddProductFab";
import { NotificationSheet } from "@/components/molecules/NotificationSheet";
import { SearchSheet } from "@/components/molecules/SearchSheet";
import { DASHBOARD_MOTION, MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { DashboardNotification } from "@/types/dashboard";

type DashboardChromeProps = {
  children: React.ReactNode;
  shopName: string;
  shopCity: string;
  ordersBadge?: number;
  notificationCount?: number;
  notifications: readonly DashboardNotification[];
  className?: string;
};

/**
 * Client chrome around server-rendered dashboard pages: sheets, FAB, and
 * view-enter motion keyed to the pathname.
 */
export function DashboardChrome({
  children,
  shopName,
  shopCity,
  ordersBadge = 0,
  notificationCount = 0,
  notifications,
  className,
}: DashboardChromeProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div
      className={cn(
        "build-app-shell mx-auto flex min-h-screen w-full max-w-[1500px] flex-col bg-paper",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1">
        <SidebarNav
          ordersBadge={ordersBadge}
          shopName={shopName}
          shopCity={shopCity}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            notificationCount={notificationCount}
            onSearch={() => setSearchOpen(true)}
            onNotifications={() => setNotifOpen(true)}
          />

          <div className="min-h-0 flex-1">
            <motion.div
              key={pathname}
              className="flex flex-col gap-4 px-3.5 pt-4 pb-[5.4rem] @[700px]:gap-[1.1rem] @[700px]:px-6 @[700px]:pt-5 @[1000px]:gap-5 @[1000px]:px-7 @[1000px]:pt-6 @[1000px]:pb-6"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: DASHBOARD_MOTION.viewRise.y }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: DASHBOARD_MOTION.viewRise.duration,
                ease: MOTION_EASE,
              }}
            >
              {children}
            </motion.div>
          </div>

          <BottomNav ordersBadge={ordersBadge} />
        </div>
      </div>

      <AddProductFab />

      <SearchSheet open={searchOpen} onOpenChange={setSearchOpen} />
      <NotificationSheet
        notifications={notifications}
        open={notifOpen}
        onOpenChange={setNotifOpen}
      />
    </div>
  );
}
