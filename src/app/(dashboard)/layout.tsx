"use client";

import { notifications } from "@/lib/data/app";
import { RequireOnboarded } from "@/components/auth/SessionGate";
import { AppShell } from "@/components/organisms/app/AppShell";
import { mapWorkspace } from "@/lib/api/mappers/workspace";
import { useSession } from "@/providers/session-provider";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { workspace } = useSession();
  // RequireOnboarded only renders its children once the session is fully
  // authenticated, at which point workspace is always populated.
  if (!workspace) return null;

  return (
    <AppShell workspace={mapWorkspace(workspace)} notifications={notifications}>
      {children}
    </AppShell>
  );
}

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireOnboarded>
      <DashboardShell>{children}</DashboardShell>
    </RequireOnboarded>
  );
}
