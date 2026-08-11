import { cn } from "@/lib/cn";

type KpiTileProps = {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  tone?: "default" | "held" | "good" | "alarm";
  className?: string;
};

export function KpiTile({
  label,
  value,
  detail,
  tone = "default",
  className,
}: KpiTileProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-hair bg-white p-3.5",
        tone === "held" && "border-berry/30 bg-berry/10",
        tone === "good" && "border-sea/30 bg-sea/10",
        tone === "alarm" && "border-clay/30 bg-clay/[0.07]",
        className,
      )}
    >
      <p className="m-0 text-[0.72rem] font-bold tracking-wide text-ink-45 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-display text-[1.35rem] leading-none font-extrabold tracking-tight tabular-nums",
          tone === "held" && "text-berry-muted",
          tone === "good" && "text-sea-muted",
          tone === "alarm" && "text-clay",
        )}
      >
        {value}
      </p>
      {detail ? (
        <p
          className={cn(
            "mt-1.5 text-[0.74rem] text-ink-45",
            tone === "held" && "text-berry-muted/80",
            tone === "good" && "text-sea-muted/80",
            tone === "alarm" && "text-clay/80",
          )}
        >
          {detail}
        </p>
      ) : null}
    </div>
  );
}
