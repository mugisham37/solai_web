import { cn } from "@/lib/utils";
import { MARKETING_ICONS } from "@/lib/marketing-icons";
import type { AfricaCardContent } from "@/types/marketing";

export function AfricaCard({ card }: { card: AfricaCardContent }) {
  const Icon = MARKETING_ICONS[card.icon];

  return (
    <div className="rounded-lg border border-border bg-surface p-7">
      <div className="mb-4 flex size-12 items-center justify-center rounded-md bg-accent-rwanda/10 text-accent-rwanda">
        <Icon size={28} />
      </div>
      <h3 className="mb-2 text-base font-semibold text-text">{card.title}</h3>
      <p className="text-sm leading-relaxed text-text-muted">{card.description}</p>
      {card.badges && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.badges.map((badge) => (
            <span
              key={badge.label}
              className={cn(
                "rounded-sm px-2.5 py-1 text-xs font-medium",
                badge.tone === "brand"
                  ? "bg-brand-soft text-brand"
                  : "border border-border bg-surface-2 text-text-muted",
              )}
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
