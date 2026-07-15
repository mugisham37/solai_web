import type { Metadata } from "next";
import { PieChart } from "lucide-react";
import { EmptyState } from "@/components/molecules/app/EmptyState";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Reports",
  description: "Analytics and reports — coming soon.",
};

export default async function ReportsPage() {
  await requireOnboardedSession();

  return (
    <EmptyState
      icon={PieChart}
      title="Reports coming soon"
      description="Weekly cohort analyses, channel breakdowns, and ROAS trends. Your Analyst Agent is already collecting the data."
    />
  );
}
