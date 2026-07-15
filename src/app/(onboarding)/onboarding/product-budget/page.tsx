import type { Metadata } from "next";
import { ProductBudgetStep } from "@/components/organisms/onboarding/ProductBudgetStep";
import { requireSession } from "@/lib/auth/require-session";
import { getOrCreateOnboardingDraft } from "@/lib/actions/onboarding";

export const metadata: Metadata = {
  title: "Product & budget",
  description: "Describe your product, audience, and spend caps for SolAI.",
};

export default async function ProductBudgetPage() {
  await requireSession();
  const draft = await getOrCreateOnboardingDraft();
  return <ProductBudgetStep draft={draft} />;
}
