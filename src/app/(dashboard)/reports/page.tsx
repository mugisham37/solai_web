import type { Metadata } from "next";
import { PieChart } from "lucide-react";
import { EmptyState } from "@/components/molecules/app/EmptyState";

export const metadata: Metadata = {
  title: "Reports",
  description: "Analytics and reports — coming soon.",
};

export default function ReportsPage() {
  return (
    <EmptyState
      icon={PieChart}
      title="Reports coming soon"
      description="Weekly cohort analyses, channel breakdowns, and ROAS trends. Your Analyst Agent is already collecting the data."
    />
  );
}
