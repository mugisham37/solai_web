import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WelcomeStep } from "@/components/organisms/onboarding/WelcomeStep";
import { requireSession } from "@/lib/auth/require-session";
import { getOnboardingDraft } from "@/lib/actions/onboarding";
import { STEP_ROUTES } from "@/types/onboarding";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Set up your SolAI account in five guided steps.",
};

export default async function OnboardingWelcomePage() {
  await requireSession();
  const draft = await getOnboardingDraft();
  if (draft && draft.currentStep > 0) {
    redirect(STEP_ROUTES[draft.currentStep]);
  }
  return <WelcomeStep />;
}
