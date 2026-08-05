import { setRequestLocale } from "next-intl/server";
import { DashboardShell } from "@/components/organisms/DashboardShell";
import { getDashboardService } from "@/lib/dashboard";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Shared dashboard layout — shell mounts once so sidebar/bottom nav persist
 * across the twelve routes without remounting.
 */
export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const dashboard = getDashboardService();
  const [shop, ordersBadge, notifications] = await Promise.all([
    dashboard.getShop(),
    dashboard.getNeedsYouCount(),
    dashboard.getNotifications(),
  ]);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DashboardShell
      shopName={shop.name}
      shopCity={shop.city}
      ordersBadge={ordersBadge}
      notificationCount={unread}
      notifications={notifications}
    >
      {children}
    </DashboardShell>
  );
}
