"use client";

import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterPillsProps {
  options: FilterOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function FilterPills({
  options,
  value,
  onChange,
  className,
}: FilterPillsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            value === option.id
              ? "border-brand bg-brand-soft text-brand"
              : "border-border bg-transparent text-text-muted hover:border-text-subtle hover:text-text"
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="font-mono text-xs text-text-subtle tnum">
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
