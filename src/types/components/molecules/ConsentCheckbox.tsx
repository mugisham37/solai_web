"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsentCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ConsentCheckbox({
  checked,
  onCheckedChange,
  required,
  children,
  className,
}: ConsentCheckboxProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5 text-[13px] text-text-muted",
        className,
      )}
      onClick={() => onCheckedChange(!checked)}
    >
      <span
        className={cn(
          "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded border-[1.5px] border-border transition-colors",
          checked && "border-brand bg-brand text-white",
        )}
      >
        {checked ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>
      <span>
        {children}{" "}
        {required ? (
          <em className="text-[11px] font-medium text-danger not-italic">Required</em>
        ) : (
          <em className="text-[11px] text-text-subtle not-italic">Optional</em>
        )}
      </span>
    </label>
  );
}
