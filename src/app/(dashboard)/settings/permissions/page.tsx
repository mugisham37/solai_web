import type { Metadata } from "next";
import { AgentPermissions } from "@/components/organisms/app/settings/AgentPermissions";

export const metadata: Metadata = {
  title: "Agent permissions — Settings",
  description: "Configure what each agent can do without asking.",
};

export default function PermissionsSettingsPage() {
  return <AgentPermissions />;
}
