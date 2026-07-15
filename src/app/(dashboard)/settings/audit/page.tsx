import type { Metadata } from "next";
import { AuditLogSettings } from "@/components/organisms/app/settings/AuditLogSettings";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Audit log — Settings",
  description: "Every action by every human and agent.",
};

export default async function AuditSettingsPage() {
  await requireOnboardedSession();

  return <AuditLogSettings />;
}
