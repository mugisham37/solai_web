import type { Metadata } from "next";
import { PaymentsStep } from "@/components/organisms/onboarding/PaymentsStep";
import { requireSession } from "@/lib/auth/require-session";
import { getOrCreateOnboardingDraft } from "@/lib/actions/onboarding";

export const metadata: Metadata = {
  title: "Payment rails",
  description: "Configure Stripe and Mobile Money payment options for your customers.",
};

export default async function PaymentsPage() {
  await requireSession();
  const draft = await getOrCreateOnboardingDraft();
  return <PaymentsStep draft={draft} />;
}
