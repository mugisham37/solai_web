import type { Metadata } from "next";
import { AuditLogSettings } from "@/components/organisms/app/settings/AuditLogSettings";

export const metadata: Metadata = {
  title: "Audit Log",
  description: "Workspace audit log.",
};

export default function AuditPage() {
  return <AuditLogSettings />;
}
