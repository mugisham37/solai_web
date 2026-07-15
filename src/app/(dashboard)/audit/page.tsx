import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { EmptyState } from "@/components/molecules/app/EmptyState";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Audit Log",
  description: "Workspace audit log — coming soon.",
};

export default async function AuditPage() {
  await requireOnboardedSession();

  return (
    <EmptyState
      icon={Clock}
      title="Audit log coming soon"
      description="A workspace-wide timeline of every agent and human action. For now, view recent events in Settings → Audit log."
      actionLabel="Open settings audit log"
      actionHref="/settings/audit"
    />
  );
}
