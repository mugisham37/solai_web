import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";
import { notifications, workspace } from "@/lib/data/app";
import { AppShell } from "@/components/organisms/app/AppShell";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOnboardedSession();

  return (
    <AppShell workspace={workspace} notifications={notifications}>
      {children}
    </AppShell>
  );
}
