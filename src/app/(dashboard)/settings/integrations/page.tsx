import type { Metadata } from "next";
import { IntegrationsSettings } from "@/components/organisms/app/settings/IntegrationsSettings";

export const metadata: Metadata = {
  title: "Integrations — Settings",
  description: "Channels, payments, and data sources your agents can act on.",
};

export default function IntegrationsSettingsPage() {
  return <IntegrationsSettings />;
}
