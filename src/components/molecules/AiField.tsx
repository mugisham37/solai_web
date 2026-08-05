"use client";

import { type ReactNode } from "react";
import { Icon } from "@/components/atoms/Icon";
import { ActionButton } from "@/components/atoms/ActionButton";
import { cn } from "@/lib/cn";

type AiFieldProps = {
  label: ReactNode;
  aiBadge: string;
  restoreLabel: string;
  originalValue: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  children: ReactNode;
  hint?: ReactNode;
};

export function AiField({
  label,
  aiBadge,
  restoreLabel,
  originalValue,
  value,
  onChange,
  onBlur,
  children,
  hint,
}: AiFieldProps) {
  const touched = value !== originalValue;
  return (
    <div className={cn("flex flex-col gap-1", !touched && "ai-field-border rounded-xl p-0.5")}>
      <span className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-45">
        {label}
        {!touched ? (
          <span className="rounded-pill bg-mauve/20 px-1.5 py-0.5 text-[0.62rem] normal-case text-[#5e4478]">
            {aiBadge}
          </span>
        ) : null}
        {touched ? (
          <ActionButton
            type="button"
            variant="plain"
            size="sm"
            className="min-h-0 px-1 py-0 text-xs font-semibold text-ink-45"
            onClick={() => onChange(originalValue)}
          >
            <Icon name="undo" size="sm" />
            {restoreLabel}
          </ActionButton>
        ) : null}
      </span>
      <div
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) onBlur?.();
        }}
      >
        {children}
      </div>
      {hint}
    </div>
  );
}
