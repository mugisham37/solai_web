import type { Metadata } from "next";
import { ReviewLaunchStep } from "@/components/organisms/onboarding/ReviewLaunchStep";
import { requireSession } from "@/lib/auth/require-session";
import { getOrCreateOnboardingDraft } from "@/lib/actions/onboarding";

export const metadata: Metadata = {
  title: "Review & launch",
  description: "Review your setup and launch your first SolAI campaign.",
};

export default async function ReviewPage() {
  await requireSession();
  const draft = await getOrCreateOnboardingDraft();
  return <ReviewLaunchStep draft={draft} />;
}
