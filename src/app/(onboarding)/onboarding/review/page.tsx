import type { Metadata } from "next";
import { ReviewLaunchStep } from "@/components/organisms/onboarding/ReviewLaunchStep";

export const metadata: Metadata = {
  title: "Review & launch",
  description: "Review your setup and launch your first SolAI campaign.",
};

export default function ReviewPage() {
  return <ReviewLaunchStep />;
}
