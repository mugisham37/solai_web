"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, Settings, Zap } from "lucide-react";
import type { Campaign, CampaignState } from "@/types/app";
import { ChannelChip } from "@/components/atoms/app/ChannelChip";
import { MoneyDisplay } from "@/components/atoms/app/MoneyDisplay";
import { StatePill } from "@/components/atoms/app/StatePill";
import { BudgetBar } from "@/components/molecules/app/BudgetBar";
import { FilterPills } from "@/components/molecules/app/FilterPills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ApprovalModal } from "./ApprovalModal";

type CampaignFilter = "all" | CampaignState;

function matchesFilter(campaign: Campaign, filter: CampaignFilter): boolean {
  if (filter === "all") return true;
  return campaign.state === filter;
}

function matchesSearch(campaign: Campaign, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    campaign.name.toLowerCase().includes(q) ||
    campaign.stage.toLowerCase().includes(q) ||
    campaign.channels.some((ch) => ch.toLowerCase().includes(q))
  );
}

interface CampaignsTableProps {
  campaigns: Campaign[];
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<CampaignFilter>("all");
  const [search, setSearch] = useState("");
  const [approvalCampaign, setApprovalCampaign] = useState<Campaign | null>(
    null
  );

  const counts = useMemo(
    () => ({
      all: campaigns.length,
      live: campaigns.filter((c) => c.state === "live").length,
      learning: campaigns.filter((c) => c.state === "learning").length,
      paused: campaigns.filter((c) => c.state === "paused").length,
      draft: campaigns.filter((c) => c.state === "draft").length,
    }),
    [campaigns]
  );

  const totalSpend = useMemo(
    () => campaigns.reduce((sum, c) => sum + c.spend, 0),
    [campaigns]
  );

  const filtered = useMemo(
    () =>
      campaigns.filter(
        (c) => matchesFilter(c, filter) && matchesSearch(c, search)
      ),
    [campaigns, filter, search]
  );

  const filterOptions = [
    { id: "all", label: "All", count: counts.all },
    { id: "live", label: "Live", count: counts.live },
    { id: "learning", label: "Learning", count: counts.learning },
    { id: "paused", label: "Paused", count: counts.paused },
    { id: "draft", label: "Awaiting approval", count: counts.draft },
  ];

  const handleRowClick = (campaign: Campaign) => {
    router.push(`/campaigns/${campaign.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-[1320px] px-6 py-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-text">
            Campaigns
          </h1>
          <p className="text-sm text-text-muted">
            {campaigns.length} campaigns · {counts.live} live · US${" "}
            {totalSpend.toLocaleString()} spent this month
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm">
            <Settings className="size-3.5" />
            Bulk edit
          </Button>
          <Button variant="cta" size="sm">
            <Zap className="size-3.5" />
            New campaign
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterPills
          options={filterOptions}
          value={filter}
          onChange={(id) => setFilter(id as CampaignFilter)}
        />
        <div className="flex-1" />
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3">
          <Search className="size-3.5 text-text-subtle" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns…"
            className="h-8 w-[200px] border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              {[
                "Name",
                "State",
                "Channels",
                "Spend / Cap",
                "ROAS",
                "Orders",
                "CPA",
                "Last edit",
                "",
              ].map((header) => (
                <th
                  key={header || "actions"}
                  className="px-3.5 py-2.5 text-left text-[11px] font-semibold tracking-wider text-text-subtle uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((campaign) => (
              <tr
                key={campaign.id}
                onClick={() => handleRowClick(campaign)}
                className="cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-surface-2"
              >
                <td className="px-3.5 py-3.5">
                  <strong className="text-sm font-medium text-text">
                    {campaign.name}
                  </strong>
                </td>
                <td className="px-3.5 py-3.5">
                  <StatePill state={campaign.state} />
                </td>
                <td className="px-3.5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {campaign.channels.map((channel) => (
                      <ChannelChip key={channel} channel={channel} />
                    ))}
                  </div>
                </td>
                <td className="min-w-[160px] px-3.5 py-3.5">
                  <MoneyDisplay amount={campaign.spend} size="sm" />
                  <span className="text-sm text-text-subtle">
                    {" "}
                    / {campaign.cap.toLocaleString()}
                  </span>
                  <BudgetBar
                    spend={campaign.spend}
                    cap={campaign.cap}
                    className="mt-1"
                  />
                </td>
                <td className="px-3.5 py-3.5 font-mono text-text tnum">
                  {campaign.roas === null ? (
                    <span className="text-text-subtle">—</span>
                  ) : (
                    `${campaign.roas.toFixed(1)}×`
                  )}
                </td>
                <td className="px-3.5 py-3.5 font-mono text-text tnum">
                  {campaign.orders}
                </td>
                <td className="px-3.5 py-3.5 font-mono text-text tnum">
                  <MoneyDisplay amount={campaign.cpa} size="sm" />
                </td>
                <td className="px-3.5 py-3.5 text-xs text-text-subtle">
                  {campaign.lastEdit}
                </td>
                <td className="px-3.5 py-3.5">
                  {campaign.state === "draft" ? (
                    <Button
                      variant="cta"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setApprovalCampaign(campaign);
                      }}
                    >
                      Review
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(campaign);
                      }}
                      className={cn(
                        "flex rounded-sm p-1 text-text-subtle hover:bg-surface-2 hover:text-text"
                      )}
                      aria-label={`Open ${campaign.name}`}
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ApprovalModal
        campaign={approvalCampaign}
        open={approvalCampaign !== null}
        onOpenChange={(open) => {
          if (!open) setApprovalCampaign(null);
        }}
      />
    </div>
  );
}
