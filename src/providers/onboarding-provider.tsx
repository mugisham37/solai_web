"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { createDefaultDraft } from "@/lib/onboarding/defaults";
import { markOnboardingComplete } from "@/lib/demo-session";
import type { OnboardingDraft, OnboardingStepIndex } from "@/types/onboarding";

const DRAFT_STORAGE_KEY = "solai_onboarding_draft";

function loadDraft(): OnboardingDraft {
  if (typeof window === "undefined") return createDefaultDraft();
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return createDefaultDraft();
    return { ...createDefaultDraft(), ...JSON.parse(raw) } as OnboardingDraft;
  } catch {
    return createDefaultDraft();
  }
}

export interface OnboardingContextValue {
  draft: OnboardingDraft;
  ready: boolean;
  advanceWelcome: () => void;
  updateConnections: (
    connections: OnboardingDraft["connections"],
    step?: OnboardingStepIndex,
  ) => void;
  updatePayments: (
    payments: OnboardingDraft["payments"],
    step?: OnboardingStepIndex,
  ) => void;
  updateProductBudget: (
    data: Pick<OnboardingDraft, "product" | "audience" | "budget">,
    step?: OnboardingStepIndex,
  ) => void;
  launchCampaign: () => Promise<OnboardingDraft["launch"]>;
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(() => createDefaultDraft());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage after mount — reading it during
    // render would desync from the server-rendered markup and trigger a
    // hydration mismatch, so this must happen client-side, post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(loadDraft());
    setReady(true);
  }, []);

  const updateDraft = useCallback(
    (updater: (prev: OnboardingDraft) => OnboardingDraft) => {
      setDraft((prev) => {
        const next = updater(prev);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    [],
  );

  const advanceWelcome = useCallback(() => {
    updateDraft((prev) => ({ ...prev, currentStep: 1 }));
  }, [updateDraft]);

  const updateConnections = useCallback(
    (connections: OnboardingDraft["connections"], step: OnboardingStepIndex = 2) => {
      updateDraft((prev) => ({ ...prev, connections, currentStep: step }));
    },
    [updateDraft],
  );

  const updatePayments = useCallback(
    (payments: OnboardingDraft["payments"], step: OnboardingStepIndex = 3) => {
      updateDraft((prev) => ({ ...prev, payments, currentStep: step }));
    },
    [updateDraft],
  );

  const updateProductBudget = useCallback(
    (
      data: Pick<OnboardingDraft, "product" | "audience" | "budget">,
      step: OnboardingStepIndex = 4,
    ) => {
      updateDraft((prev) => ({ ...prev, ...data, currentStep: step }));
    },
    [updateDraft],
  );

  const launchCampaign = useCallback(() => {
    return new Promise<OnboardingDraft["launch"]>((resolve) => {
      window.setTimeout(() => {
        const failed = Math.random() < 0.1;
        const launch: OnboardingDraft["launch"] = failed
          ? {
              status: "failed",
              errorReason:
                "Campaign creation service is temporarily unavailable. Your review data is saved.",
            }
          : { status: "success", launchedAt: new Date().toISOString() };

        updateDraft((prev) => ({
          ...prev,
          launch,
          currentStep: 4,
          completedAt: failed ? null : new Date().toISOString(),
        }));

        if (!failed) {
          markOnboardingComplete();
        }

        resolve(launch);
      }, 900);
    });
  }, [updateDraft]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft,
      ready,
      advanceWelcome,
      updateConnections,
      updatePayments,
      updateProductBudget,
      launchCampaign,
    }),
    [
      draft,
      ready,
      advanceWelcome,
      updateConnections,
      updatePayments,
      updateProductBudget,
      launchCampaign,
    ],
  );

  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}
