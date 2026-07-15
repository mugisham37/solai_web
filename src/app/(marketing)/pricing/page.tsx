import type { Metadata } from "next";
import { PricingPageContent } from "@/components/organisms/PricingPageContent";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing — subscription tiers from free to scale, or performance pricing at 8% of attributed revenue.",
};

export default function PricingPage() {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <PricingPageContent />
    </div>
  );
}
