"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type PlanType = "subscription" | "performance";

interface PlanToggleProps {
  value: PlanType;
  onChange: (value: PlanType) => void;
  className?: string;
}

export function PlanToggle({ value, onChange, className }: PlanToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as PlanType)}
      className={cn(
        "inline-flex gap-0.5 rounded-md border border-border bg-surface-2 p-0.5",
        className,
      )}
      role="tablist"
      aria-label="Pricing plan type"
    >
      <ToggleGroupItem
        value="subscription"
        aria-pressed={value === "subscription"}
        className="rounded-[7px] px-4.5 py-2 text-[13px] font-medium text-text-muted data-[state=on]:bg-brand data-[state=on]:text-white"
      >
        Subscription
      </ToggleGroupItem>
      <ToggleGroupItem
        value="performance"
        aria-pressed={value === "performance"}
        className="rounded-[7px] px-4.5 py-2 text-[13px] font-medium text-text-muted data-[state=on]:bg-brand data-[state=on]:text-white"
      >
        Performance
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
