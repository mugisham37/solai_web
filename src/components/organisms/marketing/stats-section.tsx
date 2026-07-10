import { StatBlock } from "@/components/molecules/stat-block";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { STATS } from "@/data/marketing/stats";
import type { Stat } from "@/types/marketing";

export function StatsSection({ stats = STATS }: { stats?: Stat[] }) {
  return (
    <section className="border-y border-border bg-surface">
      <StaggerGroup
        className="mx-auto flex max-w-[1280px] flex-wrap justify-center gap-10 px-4 py-10 sm:px-8 md:py-16"
        stagger={0.1}
      >
        {stats.map((stat) => (
          <StatBlock key={stat.label} stat={stat} />
        ))}
      </StaggerGroup>
    </section>
  );
}
