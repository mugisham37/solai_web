"use client";

import { ArrowRight } from "lucide-react";
import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: IconName;
  title: string;
  desc: string;
  detail: string;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  desc,
  detail,
  expanded,
  onToggle,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-7",
        className,
      )}
    >
      <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-brand-soft text-brand">
        <DynamicIcon name={icon} className="size-6" />
      </div>
      <h3 className="mb-2 text-[17px] font-semibold text-text">{title}</h3>
      <p className="text-sm leading-relaxed text-text-muted">{desc}</p>
      {expanded && (
        <p className="mt-2 border-t border-border pt-2 text-[13px] leading-relaxed text-text-subtle">
          {detail}
        </p>
      )}
      <button
        type="button"
        onClick={onToggle}
        className="mt-3 flex items-center gap-1 text-[13px] font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
      >
        {expanded ? "Show less" : "Learn more"}
        <ArrowRight className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
