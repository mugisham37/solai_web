import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { EmptyState } from "@/components/molecules/app/EmptyState";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Safety Center",
  description: "Safety monitoring — coming soon.",
};

export default async function SafetyPage() {
  await requireOnboardedSession();

  return (
    <EmptyState
      icon={Shield}
      title="Safety Center coming soon"
      description="Review quarantined messages, prompt-injection alerts, and outbound creative screening. Your Safety Agent is already active in the background."
      actionLabel="View quarantine"
      actionHref="/conversations/quarantine"
    />
  );
}
