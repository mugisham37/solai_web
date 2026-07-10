import { SectionLabel } from "@/components/atoms/section-label";
import { ComparisonColumn } from "@/components/molecules/comparison-column";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { COMPARISON_COLUMNS } from "@/data/marketing/comparison";

export function ComparisonSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 md:py-16">
      <SectionLabel>The Difference</SectionLabel>
      <h2 className="mb-4 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
        What changes when SolAI runs your growth.
      </h2>
      <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2" stagger={0.12}>
        {COMPARISON_COLUMNS.map((column) => (
          <ComparisonColumn key={column.heading} column={column} />
        ))}
      </StaggerGroup>
    </section>
  );
}
