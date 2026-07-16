"use client";

import { useContext } from "react";
import { OnboardingContext } from "@/providers/onboarding-provider";

export function useOnboardingDraft() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboardingDraft must be used within an OnboardingProvider");
  }
  return ctx;
}
