import type { Metadata } from "next";
import { ProductBudgetStep } from "@/components/organisms/onboarding/ProductBudgetStep";

export const metadata: Metadata = {
  title: "Product & budget",
  description: "Describe your product, audience, and spend caps for SolAI.",
};

export default function ProductBudgetPage() {
  return <ProductBudgetStep />;
}
