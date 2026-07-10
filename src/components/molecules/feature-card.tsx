"use client";

import { ArrowRight } from "lucide-react";

import { ExpandPanel } from "@/components/molecules/expand-panel";
import { MARKETING_ICONS } from "@/lib/marketing-icons";
import type { Feature } from "@/types/marketing";

interface FeatureCardProps {
  feature: Feature;
  isExpanded: boolean;
  onToggle: () => void;
}

export function FeatureCard({ feature, isExpanded, onToggle }: FeatureCardProps) {
  const Icon = MARKETING_ICONS[feature.icon];

  return (
    <div className="rounded-lg border border-border bg-surface p-7">
      <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-brand-soft text-brand">
        <Icon size={24} />
      </div>
      <h3 className="mb-2 text-[17px] font-semibold text-text">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-text-muted">{feature.description}</p>
      <ExpandPanel isOpen={isExpanded}>
        <p className="mt-2 border-t border-border pt-2 text-[13px] leading-relaxed text-text-subtle">
          {feature.detail}
        </p>
      </ExpandPanel>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="mt-3 flex items-center gap-1 text-[13px] font-medium text-brand hover:underline"
      >
        {isExpanded ? "Show less" : "Learn more"}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
