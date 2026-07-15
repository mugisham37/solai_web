"use client";

import Link from "next/link";
import { ChevronLeft, Copy, Settings, X } from "lucide-react";
import type {
  AbTest,
  AgentAction,
  Audience,
  AudienceStatus,
  Campaign,
  ChannelAllocation,
  Creative,
} from "@/types/app";
import { ChannelChip } from "@/components/atoms/app/ChannelChip";
import { MoneyDisplay } from "@/components/atoms/app/MoneyDisplay";
import { StatePill } from "@/components/atoms/app/StatePill";
import { BudgetBar } from "@/components/molecules/app/BudgetBar";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CreativesGrid } from "./CreativesGrid";
import { ExperimentsView } from "./ExperimentsView";
import { PlanTab } from "./PlanTab";

const audienceStatusStyles: Record<
  AudienceStatus,
  { bg: string; color: string }
> = {
  scaling: { bg: "rgba(52,211,153,0.12)", color: "var(--success)" },
  steady: { bg: "var(--brand-soft)", color: "var(--brand)" },
  learning: { bg: "rgba(122,167,255,0.12)", color: "var(--info)" },
};

interface CampaignDetailProps {
  campaign: Campaign;
  allocations: ChannelAllocation[];
  audiences: Audience[];
  agentActions: AgentAction[];
  creatives: Creative[];
  abTests: AbTest[];
}

export function CampaignDetail({
  campaign,
  allocations,
  audiences,
  agentActions,
  creatives,
  abTests,
}: CampaignDetailProps) {
  const ctr = "2.4%";
  const aov = "US$ 142";

  return (
    <div className="mx-auto w-full max-w-[1320px] px-6 py-6">
      <Link
        href="/campaigns"
        className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text"
      >
        <ChevronLeft className="size-3.5" />
        Campaigns
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <StatePill state={campaign.state} />
            <span className="text-text-subtle">·</span>
            <span>{campaign.stage}</span>
            <span className="text-text-subtle">·</span>
            <span>Created Apr 28, 2026</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-text">
            {campaign.name}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {campaign.channels.map((channel) => (
              <ChannelChip key={channel} channel={channel} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            <Copy className="size-3.5" />
            Duplicate
          </Button>
          <Button variant="secondary" size="sm">
            <Settings className="size-3.5" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-warning/30 text-warning hover:bg-warning/10"
          >
            <X className="size-3.5" />
            Pause campaign
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 min-[600px]:grid-cols-3 min-[1100px]:grid-cols-6">
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <span className="mb-1 block text-[11px] tracking-wide text-text-subtle uppercase">
            Spend / Cap
          </span>
          <div className="mb-1 flex items-baseline gap-1.5">
            <MoneyDisplay amount={campaign.spend} size="md" />
            <span className="font-mono text-sm text-text-subtle">
              / {campaign.cap.toLocaleString()}
            </span>
          </div>
          <BudgetBar spend={campaign.spend} cap={campaign.cap} />
        </div>
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <span className="mb-1 block text-[11px] tracking-wide text-text-subtle uppercase">
            ROAS
          </span>
          <span className="block font-mono text-lg font-semibold text-success tnum">
            {campaign.roas === null ? "—" : `${campaign.roas.toFixed(1)}×`}
          </span>
          <span className="mt-0.5 block text-[11px] text-text-subtle">
            +0.4× vs plan
          </span>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <span className="mb-1 block text-[11px] tracking-wide text-text-subtle uppercase">
            Orders
          </span>
          <span className="block font-mono text-lg font-semibold text-text tnum">
            {campaign.orders}
          </span>
          <span className="mt-0.5 block text-[11px] text-success">
            +12 today
          </span>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <span className="mb-1 block text-[11px] tracking-wide text-text-subtle uppercase">
            CPA
          </span>
          <span className="block font-mono text-lg font-semibold text-success tnum">
            <MoneyDisplay amount={campaign.cpa} size="md" />
          </span>
          <span className="mt-0.5 block text-[11px] text-text-subtle">
            target ≤ 40.00
          </span>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <span className="mb-1 block text-[11px] tracking-wide text-text-subtle uppercase">
            CTR
          </span>
          <span className="block font-mono text-lg font-semibold text-text tnum">
            {ctr}
          </span>
          <span className="mt-0.5 block text-[11px] text-text-subtle">
            channel avg 1.6%
          </span>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3.5">
          <span className="mb-1 block text-[11px] tracking-wide text-text-subtle uppercase">
            AOV
          </span>
          <span className="block font-mono text-lg font-semibold text-text tnum">
            {aov}
          </span>
          <span className="mt-0.5 block text-[11px] text-text-subtle">
            +US$ 8 vs avg
          </span>
        </div>
      </div>

      <Tabs defaultValue="plan" className="gap-5">
        <TabsList>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="creatives">Creatives</TabsTrigger>
          <TabsTrigger value="audiences">Audiences</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="plan">
          <PlanTab
            allocations={allocations}
            audiences={audiences}
            agentActions={agentActions}
          />
        </TabsContent>

        <TabsContent value="creatives">
          <CreativesGrid creatives={creatives} campaignName={campaign.name} />
        </TabsContent>

        <TabsContent value="audiences">
          <section className="rounded-lg border border-border bg-surface p-5">
            <h3 className="mb-1 text-[15px] font-semibold text-text">
              Active audiences
            </h3>
            <p className="mb-4 text-xs text-text-subtle">
              SolAI tested 7 audiences. These {audiences.length} are active for
              this campaign.
            </p>
            <div className="flex flex-col gap-2">
              {audiences.map((audience) => {
                const statusStyle = audienceStatusStyles[audience.status];
                return (
                  <div
                    key={audience.name}
                    className="flex items-center justify-between rounded-md border border-border bg-bg px-3 py-3"
                  >
                    <div>
                      <strong className="block text-sm text-text">
                        {audience.name}
                      </strong>
                      <span className="font-mono text-xs text-text-subtle">
                        {audience.size} matches · CPA{" "}
                        <MoneyDisplay amount={audience.cpa} size="sm" />
                      </span>
                    </div>
                    <span
                      className={cn(
                        "rounded-sm px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase"
                      )}
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {audience.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="experiments">
          <ExperimentsView tests={abTests} />
        </TabsContent>

        <TabsContent value="history">
          <section className="rounded-lg border border-border bg-surface p-5">
            <p className="py-10 text-center text-sm text-text-subtle">
              Campaign history and audit trail will appear here.
            </p>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
