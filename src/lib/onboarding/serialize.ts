import type { OnboardingDraft } from "@/types/onboarding";
import { createDefaultDraft } from "@/lib/onboarding/defaults";

export function serializeDraft(draft: OnboardingDraft) {
  return {
    connections: JSON.stringify(draft.connections),
    payments: JSON.stringify(draft.payments),
    product: JSON.stringify(draft.product),
    audience: JSON.stringify(draft.audience),
    budget: JSON.stringify(draft.budget),
    launch: JSON.stringify(draft.launch),
  };
}

export function deserializeDraft(row: {
  currentStep: number;
  connections: string;
  payments: string;
  product: string;
  audience: string;
  budget: string;
  launch: string;
  completedAt: Date | null;
}): OnboardingDraft {
  const defaults = createDefaultDraft();
  return {
    currentStep: row.currentStep as OnboardingDraft["currentStep"],
    connections: { ...defaults.connections, ...JSON.parse(row.connections) },
    payments: { ...defaults.payments, ...JSON.parse(row.payments) },
    product: { ...defaults.product, ...JSON.parse(row.product) },
    audience: { ...defaults.audience, ...JSON.parse(row.audience) },
    budget: { ...defaults.budget, ...JSON.parse(row.budget) },
    launch: { ...defaults.launch, ...JSON.parse(row.launch) },
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
  };
}
