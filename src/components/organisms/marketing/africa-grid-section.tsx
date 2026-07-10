import { AfricaCard } from "@/components/molecules/africa-card";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { AFRICA_CARDS } from "@/data/marketing/africa";

export function AfricaGridSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 md:py-16">
      <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-3" stagger={0.06}>
        {AFRICA_CARDS.map((card) => (
          <AfricaCard key={card.title} card={card} />
        ))}
      </StaggerGroup>
    </section>
  );
}
