import type { Metadata } from "next";
import { TeamSettings } from "@/components/organisms/app/settings/TeamSettings";

export const metadata: Metadata = {
  title: "Team & roles — Settings",
  description: "Manage workspace members, roles, and permissions.",
};

export default function TeamSettingsPage() {
  return <TeamSettings />;
}
