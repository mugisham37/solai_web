import { notifications, workspace } from "@/lib/data/app";
import { AppShell } from "@/components/organisms/app/AppShell";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell workspace={workspace} notifications={notifications}>
      {children}
    </AppShell>
  );
}
