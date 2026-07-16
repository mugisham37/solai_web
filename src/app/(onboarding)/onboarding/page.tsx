import type { Metadata } from "next";
import { WelcomeStep } from "@/components/organisms/onboarding/WelcomeStep";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Set up your SolAI account in five guided steps.",
};

export default function OnboardingWelcomePage() {
  return <WelcomeStep />;
}
