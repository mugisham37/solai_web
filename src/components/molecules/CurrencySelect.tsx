"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/lib/data/pricing";
import type { CurrencyCode } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  className?: string;
}

export function CurrencySelect({
  value,
  onChange,
  className,
}: CurrencySelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as CurrencyCode)}>
      <SelectTrigger
        className={cn(
          "w-auto min-w-[90px] border-border bg-bg font-mono text-[13px] text-text",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
