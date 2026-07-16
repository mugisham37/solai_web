import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsentRegionProps {
  className?: string;
}

export function ConsentRegion({ className }: ConsentRegionProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-border bg-surface px-3 py-2.5 text-xs leading-relaxed text-text-subtle",
        className,
      )}
    >
      <Shield className="mt-0.5 size-3.5 shrink-0 text-brand" />
      <span>
        Your data is processed under <strong>Rwanda Law N° 058/2021</strong> and{" "}
        <strong>GDPR</strong>. Stored in AWS af-south-1 (Cape Town).
      </span>
    </div>
  );
}
