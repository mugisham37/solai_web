import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ComparisonRow as ComparisonRowData } from "@/types/marketing";

interface ComparisonRowProps {
  row: ComparisonRowData;
  tone: "negative" | "positive";
}

export function ComparisonRow({ row, tone }: ComparisonRowProps) {
  const Icon = tone === "negative" ? X : Check;

  return (
    <div className="flex items-start gap-2.5 border-b border-border py-2 text-sm text-text-muted last:border-b-0">
      <Icon
        size={14}
        className={cn(
          "mt-0.5 shrink-0",
          tone === "negative" ? "text-danger" : "text-success",
        )}
      />
      {row.text}
    </div>
  );
}
