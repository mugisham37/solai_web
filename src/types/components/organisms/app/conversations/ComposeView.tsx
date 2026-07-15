"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronLeft, Sparkles } from "lucide-react";
import type { Channel } from "@/types/app";
import { composeAudiences } from "@/lib/data/app/conversations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChannelIcon } from "./ChannelIcon";
import { ChannelDot } from "@/components/atoms/app/ChannelChip";

const SAMPLE_MESSAGE =
  "Hi {{first_name}} 👋 We just restocked the indigo tee in your size. Free Kigali delivery this week. Want me to hold one? — From the team at Inema Boutique";

const audienceSubtitles: Record<string, string> = {
  repeat: "1,840 contacts · ordered ≥ 1 in 90d",
  wishlist: "312 contacts · saved an item but never bought",
  cart: "84 contacts · cart > 1h",
  all: "4,210 contacts · marketing consent",
};

const composeChannels: { id: Channel; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "instagram", label: "Instagram DM" },
  { id: "meta", label: "Meta Messenger" },
];

type ScheduleOption = "likely-online" | "now" | "pick-time";

export function ComposeView() {
  const [audience, setAudience] = useState("repeat");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [draft, setDraft] = useState("");
  const [schedule, setSchedule] = useState<ScheduleOption>("likely-online");

  const audienceCount =
    composeAudiences.find((a) => a.id === audience)?.count ?? 0;
  const messageText = draft || SAMPLE_MESSAGE;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6">
      <Link
        href="/conversations"
        className="mb-3 inline-flex items-center gap-1 text-[13px] text-text-muted hover:text-text"
      >
        <ChevronLeft className="size-3.5" />
        Conversations
      </Link>

      <div className="mb-5">
        <h1 className="mb-1 text-[22px] font-bold tracking-tight">
          New outbound message
        </h1>
        <p className="text-[13px] text-text-muted">
          Send to a segment via WhatsApp, IG, or Meta DM. Built by Creative
          Agent · approved by you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 min-[1101px]:grid-cols-[1fr_380px]">
        <section className="rounded-lg border border-border bg-surface p-[22px]">
          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold tracking-wide text-text-muted uppercase">
              Audience
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {composeAudiences.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-2.5 rounded-md border-[1.5px] border-border bg-bg p-3 transition-colors hover:border-text-subtle",
                    audience === option.id && "border-brand bg-brand-soft"
                  )}
                >
                  <input
                    type="radio"
                    name="audience"
                    checked={audience === option.id}
                    onChange={() => setAudience(option.id)}
                    className="mt-0.5 accent-brand"
                  />
                  <div>
                    <strong className="block text-[13px]">{option.label}</strong>
                    <span className="font-mono text-[11.5px] text-text-subtle">
                      {audienceSubtitles[option.id]}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold tracking-wide text-text-muted uppercase">
              Channel
            </label>
            <div className="flex flex-wrap gap-1.5">
              {composeChannels.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChannel(item.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border-[1.5px] border-border bg-bg px-3 py-1.5 text-[13px] text-text-muted",
                    channel === item.id && "border-brand bg-brand-soft text-brand"
                  )}
                >
                  <ChannelIcon channel={item.id} size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold tracking-wide text-text-muted uppercase">
              Message
            </label>
            <Textarea
              rows={5}
              placeholder={SAMPLE_MESSAGE}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="resize-y border-border bg-bg text-sm leading-relaxed focus-visible:border-brand focus-visible:ring-brand/30"
            />
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-pill border border-border bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-text-muted hover:bg-bg hover:text-text"
              >
                <Sparkles className="size-3.5" />
                Generate variant
              </button>
              <button
                type="button"
                className="rounded-pill border border-border bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-text-muted hover:bg-bg hover:text-text"
              >
                + Insert variable
              </button>
              <button
                type="button"
                className="rounded-pill border border-border bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-text-muted hover:bg-bg hover:text-text"
              >
                Translate to FR / RW
              </button>
              <span className="ml-auto font-mono text-[11px] text-text-subtle tnum">
                {messageText.length}/640
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wide text-text-muted uppercase">
              Schedule
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  {
                    id: "likely-online" as const,
                    label: "Send when likely-online (recommended)",
                  },
                  { id: "now" as const, label: "Send now" },
                  { id: "pick-time" as const, label: "Pick time…" },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSchedule(option.id)}
                  className={cn(
                    "rounded-pill border-[1.5px] border-border bg-bg px-3 py-1.5 text-[12.5px] text-text-muted",
                    schedule === option.id &&
                      "border-brand bg-brand-soft text-brand"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-text-subtle">
              Sales Agent will stagger to ~ 220/min to stay under WhatsApp&apos;s
              policy ceiling.
            </p>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-border bg-surface p-[18px] min-[1101px]:sticky min-[1101px]:top-20">
          <h3 className="mb-3 text-sm font-semibold">Preview</h3>
          <div className="mb-3.5 overflow-hidden rounded-lg border border-[#1F2D3D] bg-linear-to-b from-[#0c1822] to-[#1a2733]">
            <div className="flex items-center gap-2.5 border-b border-[#1F2D3D] bg-[#0d1820] px-3 py-3">
              <span className="relative flex size-6 items-center justify-center">
                <ChannelDot channel={channel} className="static size-6 border-0" />
              </span>
              <div>
                <strong className="block text-xs text-[#E5E7EB]">
                  Inema Boutique
                </strong>
                <span className="text-[10px] text-[#94A3B8]">
                  Business · verified
                </span>
              </div>
            </div>
            <div className="flex min-h-[140px] flex-col p-3.5">
              <div className="max-w-[80%] self-end rounded-[10px] rounded-br-[2px] bg-[#075E54] px-3 py-2 text-[12.5px] leading-relaxed text-white">
                <p className="mb-1">{messageText}</p>
                <span className="text-[9.5px] opacity-70">10:32 · ✓✓</span>
              </div>
            </div>
          </div>

          <div className="mb-3.5 grid grid-cols-2 gap-2">
            {[
              { label: "Recipients", value: audienceCount.toLocaleString() },
              {
                label: "Est. cost",
                value: `US$ ${(audienceCount * 0.005).toFixed(2)}`,
              },
              { label: "Est. delivery", value: "~ 8 min" },
              { label: "Predicted reply rate", value: "11–14%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-sm bg-bg px-2.5 py-2">
                <span className="block text-[10.5px] tracking-wide text-text-subtle uppercase">
                  {stat.label}
                </span>
                <strong className="font-mono text-[13px] tnum">
                  {stat.value}
                </strong>
              </div>
            ))}
          </div>

          <div className="mb-3 flex gap-2 rounded-md border border-warning/20 bg-warning/8 p-2.5 text-[11.5px] leading-relaxed text-text-muted">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
            <span>
              Marketing message — recipients can opt out with &quot;STOP&quot;.
              Sending without consent violates Meta policy and Rwandan DPL.
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1">
              Save as draft
            </Button>
            <Button className="flex-1">Review & send</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
