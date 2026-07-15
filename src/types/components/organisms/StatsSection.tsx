import { StatValue } from "@/components/atoms/StatValue";
import type { Stat } from "@/lib/data/stats";

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="border-y border-border bg-surface px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-center gap-12">
        {stats.map((stat) => (
          <StatValue key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
