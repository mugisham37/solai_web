import type {
  AgentStatus,
  AttentionItem,
  CopilotMessage,
  Kpi,
  PerformanceDataPoint,
  TimelineEvent,
} from "@/types/app";
import { KpiCard } from "@/components/molecules/app/KpiCard";
import { ActivityTimeline } from "./ActivityTimeline";
import { AgentStatusTable } from "./AgentStatusTable";
import { CopilotWidget } from "./CopilotWidget";
import { NeedsAttention } from "./NeedsAttention";
import { PerformanceChart } from "./PerformanceChart";

interface DashboardHomeProps {
  kpis: Kpi[];
  performanceData: Record<"7d" | "30d" | "90d", PerformanceDataPoint[]>;
  timelineEvents: TimelineEvent[];
  attentionItems: AttentionItem[];
  agentStatuses: AgentStatus[];
  copilotMessages: CopilotMessage[];
}

function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}

export function DashboardHome({
  kpis,
  performanceData,
  timelineEvents,
  attentionItems,
  agentStatuses,
  copilotMessages,
}: DashboardHomeProps) {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-6">
      <KpiGrid kpis={kpis} />
      <PerformanceChart data={performanceData} />
      <div className="grid grid-cols-1 gap-4 min-[1025px]:grid-cols-[2fr_1fr]">
        <ActivityTimeline events={timelineEvents} />
        <NeedsAttention items={attentionItems} />
      </div>
      <AgentStatusTable agents={agentStatuses} />
      <CopilotWidget messages={copilotMessages} />
    </div>
  );
}
