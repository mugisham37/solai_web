import { cn } from "@/lib/cn";

type GenerationStageProps = {
  label: string;
  subLabel: string;
  status: "pending" | "active" | "done";
};

export function GenerationStage({ label, subLabel, status }: GenerationStageProps) {
  return (
    <div
      className={cn(
        "flex min-h-[52px] items-start gap-2.5 text-sm transition-colors",
        status === "pending" && "text-ink-20",
        status === "active" && "text-ink",
        status === "done" && "text-ink-70",
      )}
    >
      <span
        className={cn(
          "grid size-[22px] shrink-0 place-items-center rounded-full border-2 text-[0.62rem]",
          status === "active" && "border-sun border-r-transparent motion-safe:animate-spin",
          status === "done" && "border-sea bg-sea text-white",
        )}
        aria-hidden
      >
        {status === "done" ? "✓" : ""}
      </span>
      <span>
        {label}
        <span className="mt-0.5 block text-xs text-ink-45">{subLabel}</span>
      </span>
    </div>
  );
}
