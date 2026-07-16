"use client";

import type { PermissionValue } from "@/types/app";
import { cn } from "@/lib/utils";

const segments: { value: PermissionValue; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "approve", label: "Ask first" },
  { value: "limit", label: "Capped" },
  { value: "never", label: "Never" },
];

interface SegmentedControlProps {
  value: PermissionValue;
  onChange?: (value: PermissionValue) => void;
  className?: string;
}

export function SegmentedControl({
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-md border border-border bg-surface-2 p-0.5",
        className
      )}
      role="group"
    >
      {segments.map((seg) => (
        <button
          key={seg.value}
          type="button"
          onClick={() => onChange?.(seg.value)}
          className={cn(
            "rounded-sm px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            value === seg.value
              ? "bg-brand text-white shadow-sm"
              : "text-text-muted hover:text-text"
          )}
        >
          {seg.label}
        </button>
      ))}
    </div>
  );
}
