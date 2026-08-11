import { cn } from "@/lib/cn";
import type { ConsoleAuditEntry } from "@/types/console";

type AuditEntryRowProps = {
  entry: ConsoleAuditEntry;
  className?: string;
};

const toneDot: Record<string, string> = {
  ok: "bg-sea",
  hold: "bg-berry",
  bad: "bg-clay",
  "": "bg-ink-20",
};

/** Append-only audit row — nothing here is editable. */
export function AuditEntryRow({ entry, className }: AuditEntryRowProps) {
  return (
    <div className={cn("relative flex gap-3 pb-4 last:pb-0", className)}>
      <span
        aria-hidden
        className={cn(
          "relative z-[1] mt-1.5 size-3.5 shrink-0 rounded-full",
          toneDot[entry.tone] ?? toneDot[""],
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm font-bold text-ink">
          {entry.timeLabel} · {entry.actorName} ({entry.actorRole}){" "}
          {entry.action}
        </p>
        <p className="mt-0.5 text-[0.74rem] leading-snug text-ink-45">
          {entry.detail}
        </p>
      </div>
    </div>
  );
}
