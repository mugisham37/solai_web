import {
  BarChart3,
  MessageSquare,
  Package,
  Palette,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { AgentStatus } from "@/types/app";
import { HealthDot } from "@/components/atoms/app/StatusDot";
import { WhyPopover } from "@/components/molecules/app/WhyPopover";
import { cn } from "@/lib/utils";

const agentIcons: Record<string, LucideIcon> = {
  BarChart3,
  Palette,
  TrendingUp,
  MessageSquare,
  Package,
};

interface AgentStatusTableProps {
  agents: AgentStatus[];
  className?: string;
}

export function AgentStatusTable({ agents, className }: AgentStatusTableProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface p-5",
        className
      )}
    >
      <h2 className="mb-3 text-[15px] font-semibold text-text">
        Agent Status
      </h2>
      <div className="flex flex-col">
        <div className="hidden border-b border-border py-2 text-[11px] font-semibold tracking-wide text-text-subtle uppercase min-[901px]:grid min-[901px]:grid-cols-[200px_1fr_80px_100px_40px] min-[901px]:gap-3">
          <span>Agent</span>
          <span>Current Task</span>
          <span>Runtime</span>
          <span>Health</span>
          <span className="sr-only">Actions</span>
        </div>
        {agents.map((agent) => {
          const Icon = agentIcons[agent.icon] ?? BarChart3;

          return (
            <div
              key={agent.id}
              className="border-b border-border py-2.5 last:border-b-0 min-[901px]:grid min-[901px]:grid-cols-[200px_1fr_80px_100px_40px] min-[901px]:items-center min-[901px]:gap-3"
            >
              <div className="mb-1 flex items-center gap-2 font-medium text-text min-[901px]:mb-0">
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-md border"
                  style={{
                    color: agent.color,
                    borderColor: `color-mix(in srgb, ${agent.color} 27%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${agent.color} 9%, transparent)`,
                  }}
                >
                  <Icon className="size-3.5" strokeWidth={1.5} />
                </div>
                <span className="text-[13px]">{agent.name}</span>
              </div>
              <span className="mb-1 truncate text-[13px] text-text-muted min-[901px]:mb-0">
                {agent.task}
              </span>
              <code className="mb-1 font-mono text-xs text-text-subtle min-[901px]:mb-0">
                {agent.runtime}
              </code>
              <div className="mb-1 min-[901px]:mb-0">
                <HealthDot health={agent.health} />
              </div>
              <div className="flex justify-end min-[901px]:justify-start">
                {agent.why && <WhyPopover decision={agent.why} />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
