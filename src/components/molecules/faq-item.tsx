"use client";

import { ChevronDown } from "lucide-react";

import { ExpandPanel } from "@/components/molecules/expand-panel";
import { cn } from "@/lib/utils";
import type { Faq } from "@/types/marketing";

interface FaqItemProps {
  faq: Faq;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function FaqItem({ faq, index, isOpen, onToggle }: FaqItemProps) {
  const panelId = `faq-panel-${index}`;
  const triggerId = `faq-trigger-${index}`;

  return (
    <div className={cn("border-b border-border", isOpen && "border-b-warning")}>
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-3 py-[18px] text-left text-text focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="w-7 shrink-0 font-mono text-[13px] text-text-subtle">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-base font-medium">{faq.question}</span>
        <ChevronDown
          size={20}
          className={cn(
            "shrink-0 text-text-subtle transition-transform duration-200 ease-brand",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <ExpandPanel isOpen={isOpen} id={panelId}>
        <div role="region" aria-labelledby={triggerId} className="pb-[18px] pl-10">
          <p className="text-sm leading-relaxed text-text-muted">{faq.answer}</p>
        </div>
      </ExpandPanel>
    </div>
  );
}
