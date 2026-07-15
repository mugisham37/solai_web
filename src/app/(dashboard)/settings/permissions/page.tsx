import type { Metadata } from "next";
import { AgentPermissions } from "@/components/organisms/app/settings/AgentPermissions";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Agent permissions — Settings",
  description: "Configure what each agent can do without asking.",
};

export default async function PermissionsSettingsPage() {
  await requireOnboardedSession();

  return <AgentPermissions />;
}
