import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { RailBadgeGroup } from "@/components/molecules/RailBadgeGroup";
import { LangChipGroup } from "@/components/molecules/LangChipGroup";
import type { AfricaCard } from "@/lib/data/africa";

interface AfricaGridProps {
  cards: AfricaCard[];
}

export function AfricaGrid({ cards }: AfricaGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-border bg-surface p-7"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-md bg-accent-rwanda/10 text-accent-rwanda">
              <DynamicIcon name={card.icon} className="size-7" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-text">
              {card.title}
            </h3>
            <p className="text-sm leading-relaxed text-text-muted">{card.desc}</p>
            {card.rails && <RailBadgeGroup rails={card.rails} />}
            {card.languages && <LangChipGroup languages={card.languages} />}
          </div>
        ))}
    </div>
  );
}
