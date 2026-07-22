"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import type { AuditActor, AuditEvent, EventTone } from "@/types/app";
import { StatusDot } from "@/components/atoms/app/StatusDot";
import { FilterPills } from "@/components/molecules/app/FilterPills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mapAuditEvent } from "@/lib/api/mappers/audit";
import * as auditService from "@/lib/api/services/audit";
import { useSession } from "@/providers/session-provider";
import { cn } from "@/lib/utils";

type AuditFilter =
  | "all"
  | "agents"
  | "humans"
  | "permissions"
  | "safety"
  | "money";

function normalizeTone(tone: string): EventTone {
  if (tone === "warn") return "warning";
  return tone as EventTone;
}

function actorBadgeTone(actor: AuditActor) {
  switch (actor) {
    case "agent":
      return "bg-info/10 text-info";
    case "human":
      return "bg-surface-2 text-text-muted";
    case "safety":
      return "bg-danger/10 text-danger";
    default:
      return "border border-border text-text-subtle";
  }
}

function matchesFilter(event: AuditEvent, filter: AuditFilter) {
  if (filter === "all") return true;
  if (filter === "agents") return event.actor === "agent";
  if (filter === "humans") return event.actor === "human";
  if (filter === "safety") return event.actor === "safety";
  if (filter === "permissions") {
    return event.action.toLowerCase().includes("permission");
  }
  if (filter === "money") {
    const text = `${event.action} ${event.meta}`.toLowerCase();
    return (
      text.includes("rwf") ||
      text.includes("us$") ||
      text.includes("refund") ||
      text.includes("budget") ||
      text.includes("spend")
    );
  }
  return true;
}

function matchesSearch(event: AuditEvent, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    event.who.toLowerCase().includes(q) ||
    event.action.toLowerCase().includes(q) ||
    event.meta.toLowerCase().includes(q)
  );
}

export function AuditLogSettings() {
  const { workspace } = useSession();
  const [filter, setFilter] = useState<AuditFilter>("all");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);

  const auditQuery = useQuery({
    queryKey: ["audit", workspace?.id, limit],
    queryFn: () =>
      auditService.listAudit({
        limit,
        offset: 0,
        workspaceId: workspace?.id,
      }),
    enabled: Boolean(workspace?.id),
  });

  const auditEvents = useMemo(
    () => (auditQuery.data?.items ?? []).map(mapAuditEvent),
    [auditQuery.data?.items],
  );

  const counts = useMemo(
    () => ({
      all: auditEvents.length,
      agents: auditEvents.filter((e) => e.actor === "agent").length,
      humans: auditEvents.filter((e) => e.actor === "human").length,
      permissions: auditEvents.filter((e) =>
        e.action.toLowerCase().includes("permission")
      ).length,
      safety: auditEvents.filter((e) => e.actor === "safety").length,
      money: auditEvents.filter((e) => {
        const text = `${e.action} ${e.meta}`.toLowerCase();
        return (
          text.includes("rwf") ||
          text.includes("us$") ||
          text.includes("refund") ||
          text.includes("budget") ||
          text.includes("spend")
        );
      }).length,
    }),
    []
  );

  const filtered = useMemo(
    () =>
      auditEvents.filter(
        (event) => matchesFilter(event, filter) && matchesSearch(event, search)
      ),
    [filter, search]
  );

  const filterOptions = [
    { id: "all", label: "All", count: counts.all },
    { id: "agents", label: "Agents", count: counts.agents },
    { id: "humans", label: "Humans", count: counts.humans },
    { id: "permissions", label: "Permission changes", count: counts.permissions },
    { id: "safety", label: "Safety", count: counts.safety },
    { id: "money", label: "Money", count: counts.money },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 min-[900px]:px-9">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Audit log
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Every action by every human and agent. Tamper-evident, kept 13
            months.
          </p>
        </div>
      </header>

      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <FilterPills
          options={filterOptions}
          value={filter}
          onChange={(id) => setFilter(id as AuditFilter)}
        />
        <div className="relative ml-auto min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-subtle" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events…"
            className="pl-9"
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        {auditQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-text-muted" />
          </div>
        ) : (
        <ul>
          {filtered.map((event, index) => {
            const showDay =
              index === 0 || filtered[index - 1]?.day !== event.day;

            return (
              <li key={event.id}>
                {showDay && (
                  <div className="border-b border-border bg-surface-2 px-[18px] py-2.5 text-[11px] font-semibold tracking-wider text-text-subtle uppercase">
                    {event.day}
                  </div>
                )}
                <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3 border-b border-border px-[18px] py-3 last:border-b-0 min-[700px]:grid-cols-[24px_80px_1fr_auto]">
                  <StatusDot
                    tone={normalizeTone(event.tone)}
                    className="mt-1.5"
                  />
                  <div className="hidden min-[700px]:block">
                    <p className="font-mono text-xs text-text-muted">
                      {event.time}
                    </p>
                  </div>
                  <div className="col-span-2 min-[700px]:col-span-1">
                    <p className="mb-1 font-mono text-xs text-text-muted min-[700px]:hidden">
                      {event.time}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm leading-relaxed text-text">
                      <Badge
                        className={cn(
                          "border-0 font-mono text-[10px] uppercase",
                          actorBadgeTone(event.actor)
                        )}
                      >
                        {event.who}
                      </Badge>
                      <span>{event.action}</span>
                    </div>
                    <p className="mt-0.5 font-mono text-[11.5px] text-text-subtle">
                      {event.meta}
                    </p>
                  </div>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Details
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-[18px] py-3 text-xs text-text-subtle">
          <span>
            Showing {filtered.length} of {auditQuery.data?.total ?? 0} events
          </span>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            disabled={
              !auditQuery.data ||
              limit >= (auditQuery.data.total ?? 0)
            }
            onClick={() => setLimit((current) => current + 20)}
          >
            Load more
          </Button>
        </div>
      </section>
    </div>
  );
}
