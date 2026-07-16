import type { Metadata } from "next";
import { AuditLogSettings } from "@/components/organisms/app/settings/AuditLogSettings";

export const metadata: Metadata = {
  title: "Audit log — Settings",
  description: "Every action by every human and agent.",
};

export default function AuditSettingsPage() {
  return <AuditLogSettings />;
}
