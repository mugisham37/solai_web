import type { Metadata } from "next";
import { IntegrationsSettings } from "@/components/organisms/app/settings/IntegrationsSettings";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Integrations — Settings",
  description: "Channels, payments, and data sources your agents can act on.",
};

export default async function IntegrationsSettingsPage() {
  await requireOnboardedSession();

  return <IntegrationsSettings />;
}
