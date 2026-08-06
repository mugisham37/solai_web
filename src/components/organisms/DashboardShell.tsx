import { DashboardChrome } from "@/components/organisms/DashboardChrome";
import { ToastProvider } from "@/components/providers/ToastProvider";
import type { DashboardNotification } from "@/types/dashboard";

type DashboardShellProps = {
  children: React.ReactNode;
  shopName: string;
  shopCity: string;
  ordersBadge?: number;
  notificationCount?: number;
  notifications?: readonly DashboardNotification[];
  className?: string;
};

/**
 * Persistent dashboard chrome. Server component wrapper keeps ToastProvider
 * above the client chrome that owns sheets and the FAB.
 */
export function DashboardShell({
  children,
  shopName,
  shopCity,
  ordersBadge = 0,
  notificationCount = 0,
  notifications = [],
  className,
}: DashboardShellProps) {
  return (
    <ToastProvider>
      <DashboardChrome
        shopName={shopName}
        shopCity={shopCity}
        ordersBadge={ordersBadge}
        notificationCount={notificationCount}
        notifications={notifications}
        className={className}
      >
        {children}
      </DashboardChrome>
    </ToastProvider>
  );
}
