"use client";

import { useState } from "react";
import { Copy, X, Zap } from "lucide-react";
import type { Creative, CreativeStatus } from "@/types/app";
import { ChannelChip } from "@/components/atoms/app/ChannelChip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formatLabels: Record<Creative["format"], string> = {
  reel: "Reel · 9:16",
  square: "Feed · 1:1",
  wide: "Search · Headline",
};

const aspectClasses: Record<Creative["format"], string> = {
  reel: "aspect-[9/16]",
  square: "aspect-square",
  wide: "aspect-video",
};

const statusColors: Record<CreativeStatus, string> = {
  winning: "text-success",
  live: "text-text",
  paused: "text-warning",
};

interface CreativesGridProps {
  creatives: Creative[];
  campaignName: string;
}

export function CreativesGrid({ creatives, campaignName }: CreativesGridProps) {
  const [selectedId, setSelectedId] = useState(creatives[0]?.id ?? "");
  const selected = creatives.find((c) => c.id === selectedId) ?? creatives[0];

  if (!selected) {
    return (
      <p className="py-10 text-center text-sm text-text-subtle">
        No creatives yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[900px]:grid-cols-[1fr_320px]">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
        {creatives.map((creative) => (
          <button
            key={creative.id}
            type="button"
            onClick={() => setSelectedId(creative.id)}
            className={cn(
              "overflow-hidden rounded-lg border-[1.5px] border-border bg-surface text-left transition-colors hover:border-text-subtle",
              selectedId === creative.id && "border-brand"
            )}
          >
            <div
              className={cn(
                "relative flex flex-col justify-end gap-2 bg-gradient-to-br from-[#1B2240] to-[#11141B] p-3.5 text-white",
                aspectClasses[creative.format]
              )}
            >
              <div className="absolute top-2.5 left-2.5">
                <ChannelChip channel={creative.channel} />
              </div>
              <div className="absolute top-2.5 right-2.5 rounded-sm bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/60">
                {formatLabels[creative.format]}
              </div>
              <p className="text-sm leading-snug text-white italic">
                {creative.copy}
              </p>
              {creative.status === "winning" && (
                <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-sm bg-success px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                  <Zap className="size-3" />
                  Winning
                </div>
              )}
              {creative.status === "paused" && (
                <div className="absolute right-2.5 bottom-2.5 rounded-sm bg-warning/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-black uppercase">
                  Paused
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 border-t border-border bg-bg px-3 py-2.5">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-text-subtle uppercase">
                  CTR
                </span>
                <strong className="font-mono text-[13px] text-text tnum">
                  {creative.ctr}%
                </strong>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-text-subtle uppercase">
                  CPA
                </span>
                <strong className="font-mono text-[13px] text-text tnum">
                  ${creative.cpa.toFixed(2)}
                </strong>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] text-text-subtle uppercase">
                  Impr.
                </span>
                <strong className="font-mono text-[13px] text-text tnum">
                  {(creative.impr / 1000).toFixed(1)}K
                </strong>
              </div>
            </div>
          </button>
        ))}
      </div>

      <aside className="sticky top-20 h-fit rounded-lg border border-border bg-surface p-4.5">
        <h3 className="mb-3 text-sm font-semibold text-text">Variant detail</h3>
        <div
          className={cn(
            "mb-3.5 flex max-h-60 items-center justify-center rounded-md bg-gradient-to-br from-[#1B2240] to-[#11141B] font-mono text-[11px] text-white",
            aspectClasses[selected.format]
          )}
        >
          {formatLabels[selected.format]}
        </div>
        <div className="mb-3.5 grid grid-cols-2 gap-2">
          {[
            { label: "CTR", value: `${selected.ctr}%` },
            { label: "CPA", value: `US$ ${selected.cpa.toFixed(2)}` },
            {
              label: "Impressions",
              value: selected.impr.toLocaleString(),
            },
            {
              label: "Status",
              value: selected.status,
              className: statusColors[selected.status],
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-sm bg-bg px-2.5 py-2"
            >
              <span className="block text-[10px] text-text-subtle uppercase">
                {stat.label}
              </span>
              <strong
                className={cn(
                  "font-mono text-sm capitalize",
                  stat.className ?? "text-text"
                )}
              >
                {stat.value}
              </strong>
            </div>
          ))}
        </div>
        <h4 className="mb-1.5 text-xs font-semibold text-text">
          Generation prompt
        </h4>
        <p className="mb-3.5 text-xs leading-relaxed text-text-muted">
          &ldquo;Highlight craftsmanship and indigo dye process. Reach women
          25-34 in Kigali, Nairobi, and EU diaspora. Tone: confident, not
          formal. Test French + Kinyarwanda voiceover.&rdquo;
        </p>
        <h4 className="mb-1.5 text-xs font-semibold text-text">
          Why this won
        </h4>
        <p className="mb-4 text-xs leading-relaxed text-text-muted">
          {selected.status === "winning"
            ? `Reels ${selected.id.toUpperCase()} drove ${selected.ctr}% CTR — above channel baseline — because the indigo dye process clip hits longer dwell. Optimizer increased its budget share.`
            : `${formatLabels[selected.format]} variant is ${selected.status}. Monitor performance over the next 48h before scaling.`}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Copy className="size-3.5" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" className="text-warning">
            <X className="size-3.5" />
            Pause
          </Button>
        </div>
        <p className="mt-4 text-[11px] text-text-subtle">
          {campaignName} · {creatives.length} variants · Generated by Creative
          Agent
        </p>
      </aside>
    </div>
  );
}
