"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  ChevronRight,
  Info,
  Shield,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { AgentPermissionProfile, PermissionValue } from "@/types/app";
import { SegmentedControl } from "@/components/molecules/app/SegmentedControl";
import { Button } from "@/components/ui/button";
import { agentPermissions } from "@/lib/data/app/settings";
import { cn } from "@/lib/utils";

const agentMeta: Record<
  string,
  { icon: LucideIcon; description: string }
> = {
  sales: {
    icon: Sparkles,
    description: "Replies to inbound DMs, qualifies leads, books orders.",
  },
  support: {
    icon: Shield,
    description: "Handles order status, returns, basic FAQ.",
  },
  creative: {
    icon: Zap,
    description: "Drafts ads, captions, and product photography copy.",
  },
  analyst: {
    icon: BarChart3,
    description: "Reads metrics, runs cohort & A/B analyses.",
  },
  safety: {
    icon: Shield,
    description: "Filters inbound messages and screens outbound creative.",
  },
};

function buildInitialPermissions(profiles: AgentPermissionProfile[]) {
  const map: Record<string, PermissionValue> = {};
  for (const profile of profiles) {
    for (const group of profile.groups) {
      for (const row of group.rows) {
        map[row.key] = row.value;
      }
    }
  }
  return map;
}

function countByValue(values: PermissionValue[], target: PermissionValue) {
  return values.filter((value) => value === target).length;
}

export function AgentPermissions() {
  const [activeAgentId, setActiveAgentId] = useState(agentPermissions[0]?.id);
  const [permissions, setPermissions] = useState(() =>
    buildInitialPermissions(agentPermissions)
  );

  const activeAgent =
    agentPermissions.find((agent) => agent.id === activeAgentId) ??
    agentPermissions[0];

  const activeValues = useMemo(() => {
    if (!activeAgent) return [];
    return activeAgent.groups.flatMap((group) =>
      group.rows.map((row) => permissions[row.key] ?? row.value)
    );
  }, [activeAgent, permissions]);

  const allValues = useMemo(() => Object.values(permissions), [permissions]);

  const handleChange = (key: string, value: PermissionValue) => {
    setPermissions((current) => ({ ...current, [key]: value }));
  };

  if (!activeAgent) return null;

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 min-[900px]:px-9">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Agent permissions
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            What each agent can do without asking. Change anything — defaults
            are conservative.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">Reset to defaults</Button>
          <Button variant="default">Save changes</Button>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3.5 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3.5">
        <Shield className="size-[18px] shrink-0 text-brand" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text">
            Trust budget — what&apos;s at stake right now
          </p>
          <p className="text-xs text-text-muted">
            {countByValue(allValues, "auto")} actions auto-run ·{" "}
            {countByValue(allValues, "approve")} ask first ·{" "}
            {countByValue(allValues, "never")} never ·{" "}
            {countByValue(allValues, "limit")} capped by envelope. Last review 2
            days ago.
          </p>
        </div>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/settings/audit">View audit log →</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[1100px]:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-lg border border-border bg-surface p-3.5 min-[1100px]:sticky min-[1100px]:top-20">
          <h3 className="mb-2 px-1 text-[11px] font-semibold tracking-wider text-text-subtle uppercase">
            Agents
          </h3>
          <div className="flex flex-col gap-0.5">
            {agentPermissions.map((agent) => {
              const meta = agentMeta[agent.id];
              const Icon = meta?.icon ?? Sparkles;
              const active = agent.id === activeAgent.id;

              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => setActiveAgentId(agent.id)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-md px-2.5 py-2.5 text-left transition-colors",
                    active
                      ? "bg-brand-soft"
                      : "hover:bg-surface-2"
                  )}
                >
                  <span
                    className="flex size-[30px] shrink-0 items-center justify-center rounded-sm"
                    style={{
                      background: `${agent.color}22`,
                      color: agent.color,
                    }}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm text-text">
                      {agent.name}
                    </strong>
                    <span className="block text-[11.5px] leading-snug text-text-subtle">
                      {meta?.description}
                    </span>
                  </span>
                  <ChevronRight className="mt-1 size-3.5 shrink-0 text-text-subtle" />
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-1.5 rounded-md bg-bg p-2.5 text-[11.5px] leading-relaxed text-text-subtle">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Permissions are per-agent. Owner & Admin can change them;
              Operator can only read.
            </span>
          </div>
        </aside>

        <section className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h3 className="text-base font-semibold text-text">
              {activeAgent.name}
            </h3>
            <span className="font-mono text-xs text-text-muted">
              {countByValue(activeValues, "auto")} auto ·{" "}
              {countByValue(activeValues, "approve")} ask first ·{" "}
              {countByValue(activeValues, "limit")} capped ·{" "}
              {countByValue(activeValues, "never")} never
            </span>
          </div>

          {activeAgent.groups.map((group) => (
            <div key={group.title} className="border-b border-border last:border-b-0">
              <div className="bg-surface-2 px-5 py-3 text-[11px] font-semibold tracking-wider text-text-subtle uppercase">
                {group.title}
              </div>
              {group.rows.map((row) => (
                <div
                  key={row.key}
                  className="grid grid-cols-1 items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 min-[900px]:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="text-sm font-medium text-text">{row.label}</p>
                    <p className="text-xs leading-relaxed text-text-muted">
                      {row.description}
                    </p>
                    {row.envelope && (
                      <p className="mt-1 text-[11.5px] text-brand">
                        Envelope: {row.envelope}
                      </p>
                    )}
                  </div>
                  <SegmentedControl
                    value={permissions[row.key] ?? row.value}
                    onChange={(value) => handleChange(row.key, value)}
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="flex gap-2 bg-surface-2 px-5 py-3.5 text-xs leading-relaxed text-text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0 text-text-subtle" />
            <span>
              Anything set to <strong className="text-text">Ask first</strong>{" "}
              appears in your approval queue. Anything{" "}
              <strong className="text-text">capped</strong> auto-pauses when the
              envelope is hit.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
