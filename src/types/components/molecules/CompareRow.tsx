import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareRowProps {
  text: string;
  type: "without" | "with";
}

export function CompareRow({ text, type }: CompareRowProps) {
  return (
    <div className="flex items-start gap-2.5 border-b border-border py-2 text-sm text-text-muted last:border-b-0">
      <span
        className={cn(
          "mt-0.5 shrink-0",
          type === "without" ? "text-danger" : "text-success",
        )}
      >
        {type === "without" ? (
          <X className="size-3.5" strokeWidth={1.5} />
        ) : (
          <Check className="size-3.5" strokeWidth={1.5} />
        )}
      </span>
      {text}
    </div>
  );
}
