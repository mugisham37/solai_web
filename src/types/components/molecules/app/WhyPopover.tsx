"use client";

import { useState } from "react";
import { ArrowRight, Copy, X } from "lucide-react";
import type { WhyDecision } from "@/types/app";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WhyPopoverProps {
  decision: WhyDecision;
  title?: string;
  className?: string;
}

export function WhyPopover({
  decision,
  title = "Why this decision?",
  className,
}: WhyPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-sm px-1.5 py-0.5 text-xs font-medium text-brand transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        Why?
      </button>
      {open && (
        <div
          className="absolute top-full right-0 z-20 mt-2 w-[340px] rounded-lg border border-border bg-surface p-4 shadow-[var(--e3)]"
          role="dialog"
          aria-label={title}
        >
          <div className="mb-3 flex items-center justify-between">
            <strong className="text-sm">{title}</strong>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-sm p-1 text-text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Close"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <p className="mb-2 text-sm text-text">{decision.headline}</p>
          <ul className="mb-3 space-y-1 text-sm text-text-muted">
            {decision.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="text-brand">•</span>
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="font-medium text-brand">{decision.agent}</span>
            <code className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-text-subtle">
              {decision.runId}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(decision.runId)}
              className="text-text-muted hover:text-text"
              aria-label="Copy run ID"
            >
              <Copy className="size-3" />
            </button>
          </div>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
            Open full decision
            <ArrowRight className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
