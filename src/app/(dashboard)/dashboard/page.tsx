import type { Metadata } from "next";
import { DashboardHome } from "@/components/organisms/app/dashboard/DashboardHome";
import {
  agentStatuses,
  attentionItems,
  copilotMessages,
  dashboardKpis,
  performanceData,
  timelineEvents,
} from "@/lib/data/app/dashboard";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your SolAI command center — KPIs, agent activity, and performance.",
};

export default async function DashboardPage() {
  await requireOnboardedSession();

  return (
    <DashboardHome
      kpis={dashboardKpis}
      performanceData={performanceData}
      timelineEvents={timelineEvents}
      attentionItems={attentionItems}
      agentStatuses={agentStatuses}
      copilotMessages={copilotMessages}
    />
  );
}
