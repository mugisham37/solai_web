"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Shield } from "lucide-react";
import { quarantineItems } from "@/lib/data/app/conversations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuarantineView() {
  const [selectedId, setSelectedId] = useState(quarantineItems[0]?.id ?? "");
  const selected =
    quarantineItems.find((item) => item.id === selectedId) ??
    quarantineItems[0];

  if (!selected) return null;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <Link
        href="/conversations"
        className="mb-3 inline-flex items-center gap-1 text-[13px] text-text-muted hover:text-text"
      >
        <ChevronLeft className="size-3.5" />
        Conversations
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-[22px] font-bold tracking-tight">
            Quarantine
          </h1>
          <p className="text-[13px] text-text-muted">
            Messages held back by Safety Agent. Nothing here was sent to a
            customer-facing agent.
          </p>
        </div>
        <Button variant="secondary">Export log</Button>
      </div>

      <div className="mb-4.5 flex flex-wrap items-center gap-3.5 rounded-lg border border-danger/20 bg-danger/6 px-4 py-3.5">
        <Shield className="size-4 shrink-0 text-danger" />
        <div className="min-w-0 flex-1">
          <strong className="block text-[13.5px]">
            {quarantineItems.length} messages quarantined in the last 24h
          </strong>
          <span className="text-xs text-text-muted">
            0 reached a downstream agent. 0 affected customer-facing replies.
          </span>
        </div>
        <button
          type="button"
          className="text-[13px] font-medium text-brand hover:underline"
        >
          Why was each one held? →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[1101px]:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-2">
          {quarantineItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "flex flex-col gap-1.5 rounded-md border-[1.5px] border-border bg-surface p-3.5 text-left transition-colors hover:border-text-subtle",
                selected.id === item.id &&
                  "border-danger bg-danger/4"
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <strong className="font-mono text-[13px]">{item.from}</strong>
                <span className="shrink-0 font-mono text-[11px] text-text-subtle tnum">
                  {item.time}
                </span>
              </div>
              <p className="line-clamp-2 text-[12.5px] leading-relaxed text-text-muted italic">
                {item.preview}
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-danger/15 px-2 py-0.5 text-[10.5px] font-semibold tracking-wide text-danger uppercase">
                  {item.reason}
                </span>
                <span className="font-mono text-[11px] text-text-subtle tnum">
                  risk {(item.score * 100).toFixed(0)}%
                </span>
              </div>
            </button>
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-border bg-surface p-[18px] min-[1101px]:sticky min-[1101px]:top-20">
          <h3 className="mb-2.5 text-[15px] font-semibold">Quarantine detail</h3>

          <div className="mb-1.5 flex flex-col gap-1 rounded-sm bg-bg p-2.5 text-xs text-text-muted">
            <span>
              From: <strong className="font-mono text-text">{selected.from}</strong>
            </span>
            <span>
              Channel:{" "}
              <strong className="font-mono text-text">{selected.channel}</strong>
            </span>
            <span>
              Held: <strong className="font-mono text-text">{selected.time}</strong>
            </span>
            <span>
              Risk:{" "}
              <strong className="font-mono text-danger">
                {(selected.score * 100).toFixed(0)}%
              </strong>
            </span>
          </div>

          <h4 className="mt-3.5 mb-1.5 text-[11px] font-semibold tracking-wide text-text-subtle uppercase">
            Why this was held
          </h4>
          <div className="flex gap-2.5 rounded-md border border-danger/20 bg-danger/6 p-3">
            <Shield className="mt-0.5 size-4 shrink-0 text-danger" />
            <div>
              <strong className="mb-1 block text-[13px]">{selected.reason}</strong>
              <p className="text-xs leading-relaxed text-text-muted">
                Safety Agent matched this message against known threat patterns.
                Sender has been flagged. No downstream agent saw the content.
              </p>
            </div>
          </div>

          <h4 className="mt-3.5 mb-1.5 text-[11px] font-semibold tracking-wide text-text-subtle uppercase">
            Raw message (read-only)
          </h4>
          <pre className="rounded-md border border-border bg-bg p-3 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap">
            {selected.raw}
          </pre>

          <h4 className="mt-3.5 mb-1.5 text-[11px] font-semibold tracking-wide text-text-subtle uppercase">
            Decision
          </h4>
          <div className="flex flex-col gap-1.5">
            <Button variant="secondary" className="w-full justify-start">
              Mark as legit (release)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-warning/30 text-warning hover:bg-warning/10"
            >
              Block sender
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              Report to Meta
            </Button>
          </div>
          <p className="mt-2 text-xs text-text-subtle">
            Releasing forwards the message to the relevant agent. Both decisions
            are logged to the audit trail and visible to admins.
          </p>
        </aside>
      </div>
    </div>
  );
}
