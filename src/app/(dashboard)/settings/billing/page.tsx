import type { Metadata } from "next";
import { BillingSettings } from "@/components/organisms/app/settings/BillingSettings";

export const metadata: Metadata = {
  title: "Billing & usage — Settings",
  description: "Plan, usage metrics, spend envelopes, and invoices.",
};

export default function BillingSettingsPage() {
  return <BillingSettings />;
}
