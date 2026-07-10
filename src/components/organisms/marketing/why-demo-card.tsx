"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";

import { ExpandPanel } from "@/components/molecules/expand-panel";
import { Button } from "@/components/ui/button";
import { WHY_DEMO } from "@/data/marketing/why-demo";

export function WhyDemoCard() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="w-full max-w-[380px] rounded-lg border border-border bg-bg p-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-text-subtle">{WHY_DEMO.label}</span>
        <Button
          type="button"
          variant="subtle"
          size="sm"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
        >
          Why?
        </Button>
      </div>
      <div className="font-mono text-[32px] font-semibold text-text tabular-nums">
        {WHY_DEMO.value}
        <span className="text-[22px] text-text-muted">{WHY_DEMO.decimalSuffix}</span>
      </div>
      <div className="mt-1 text-[13px] text-text-subtle">
        {WHY_DEMO.capNote} · <span className="text-success">{WHY_DEMO.statusLabel}</span>
      </div>

      <ExpandPanel isOpen={isOpen} id={panelId}>
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-text">
              Why this spend level?
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
              className="flex text-text-subtle hover:text-text"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mb-2 text-sm font-medium text-text">{WHY_DEMO.reasonHeading}</p>
          <ul className="mb-2 flex flex-col gap-0.5">
            {WHY_DEMO.reasons.map((reason) => (
              <li
                key={reason}
                className="relative pl-3.5 text-[13px] text-text-muted before:absolute before:left-0 before:font-bold before:text-text-subtle before:content-['·']"
              >
                {reason}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 border-t border-border pt-2 text-xs">
            <span className="font-medium text-brand">{WHY_DEMO.agentName}</span>
            <code className="font-mono text-[11px] text-text-subtle">
              {WHY_DEMO.runId}
            </code>
          </div>
        </div>
      </ExpandPanel>
    </div>
  );
}
