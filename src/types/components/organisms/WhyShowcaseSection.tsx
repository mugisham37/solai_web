"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { SectionLabel } from "@/components/atoms/SectionLabel";

const whyDemo = {
  caption: "Total Spend · Today",
  value: "US$ 4,231",
  decimal: ".45",
  sub: "of US$ 10,000 cap",
  status: "Inside cap",
  title: "Why this spend level?",
  headline: "Increased Instagram Reels budget by 15%",
  bullets: [
    "CPA tracking 18% under target (US$ 8.45 vs US$ 12.00)",
    "Reels CTR 3.2% — 1.8× above Feed average",
    "ROAS 3.8x — highest across all active ad sets",
  ],
  agent: "Real-time Optimizer",
  runId: "run_7f3a…e91c",
};

export function WhyShowcaseSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-y border-border bg-surface px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1280px]">
        <SectionLabel>Explainable AI</SectionLabel>
        <h2 className="mb-4 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
          Every number has an <em>&ldquo;Why?&rdquo;</em>
        </h2>
        <p className="mb-6 max-w-[640px] text-[clamp(16px,1.8vw,18px)] text-text-muted">
          SolAI doesn&apos;t just act — it explains. Every budget shift, creative
          pick, audience change, and chat reply is logged with the reasoning
          behind it.
        </p>
        <div className="flex justify-center">
          <div className="relative w-full max-w-[380px] rounded-lg border border-border bg-bg p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-text-subtle">{whyDemo.caption}</span>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="rounded px-2 py-0.5 text-xs font-medium text-brand hover:bg-brand-soft focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                Why?
              </button>
            </div>
            <div className="tnum font-mono text-[32px] font-semibold text-text">
              {whyDemo.value}
              <span className="text-[22px] text-text-muted">{whyDemo.decimal}</span>
            </div>
            <div className="mt-1 text-[13px] text-text-subtle">
              {whyDemo.sub} ·{" "}
              <span className="inline-flex items-center gap-1 text-success">
                <span aria-hidden>✓</span> {whyDemo.status}
              </span>
            </div>
            {open && (
              <div className="mt-4 border-t border-border pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-text">
                    {whyDemo.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="text-text-subtle hover:text-text focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <p className="mb-2 text-sm font-medium text-text">
                  {whyDemo.headline}
                </p>
                <ul className="mb-2 space-y-1">
                  {whyDemo.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="relative pl-3.5 text-[13px] text-text-muted before:absolute before:left-0 before:font-bold before:text-text-subtle before:content-['·']"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 border-t border-border pt-2 text-xs">
                  <span className="font-medium text-brand">{whyDemo.agent}</span>
                  <code className="font-mono text-[11px] text-text-subtle">
                    {whyDemo.runId}
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
