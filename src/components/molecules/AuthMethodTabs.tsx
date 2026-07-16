"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type AuthMethod = "email" | "passkey" | "magic";

interface AuthMethodTabsProps {
  value: AuthMethod;
  onChange: (value: AuthMethod) => void;
  className?: string;
}

const METHODS: { id: AuthMethod; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "passkey", label: "Passkey" },
  { id: "magic", label: "Magic link" },
];

export function AuthMethodTabs({ value, onChange, className }: AuthMethodTabsProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as AuthMethod)}
      className={cn(
        "mb-6 flex w-full gap-0.5 rounded-md border border-border bg-surface-2 p-0.5",
        className,
      )}
      role="tablist"
      aria-label="Sign up method"
    >
      {METHODS.map((method) => (
        <ToggleGroupItem
          key={method.id}
          value={method.id}
          aria-pressed={value === method.id}
          className="h-auto flex-1 rounded-[7px] py-2 text-[13px] font-medium text-text-muted data-[state=on]:bg-brand data-[state=on]:text-white"
        >
          {method.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
