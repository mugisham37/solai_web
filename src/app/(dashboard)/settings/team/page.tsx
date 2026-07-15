import type { Metadata } from "next";
import { TeamSettings } from "@/components/organisms/app/settings/TeamSettings";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Team & roles — Settings",
  description: "Manage workspace members, roles, and permissions.",
};

export default async function TeamSettingsPage() {
  await requireOnboardedSession();

  return <TeamSettings />;
}
