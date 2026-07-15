import type { Metadata } from "next";
import { BillingSettings } from "@/components/organisms/app/settings/BillingSettings";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Billing & usage — Settings",
  description: "Plan, usage metrics, spend envelopes, and invoices.",
};

export default async function BillingSettingsPage() {
  await requireOnboardedSession();

  return <BillingSettings />;
}
