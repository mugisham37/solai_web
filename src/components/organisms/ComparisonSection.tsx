import { SectionLabel } from "@/components/atoms/SectionLabel";
import { CompareRow } from "@/components/molecules/CompareRow";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { comparisonData } from "@/lib/data/comparison";

export function ComparisonSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
      <SectionLabel>The Difference</SectionLabel>
      <h2 className="mb-8 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
        What changes when SolAI runs your growth.
      </h2>
      <ScrollReveal className="grid grid-cols-1 gap-5 sm:grid-cols-2" stagger={0.12}>
        <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-7">
          <h3 className="mb-5 text-xl font-semibold text-text">
            <em>Without</em> SolAI
          </h3>
          {comparisonData.without.map((text) => (
            <CompareRow key={text} text={text} type="without" />
          ))}
          <div className="absolute right-0 bottom-0 left-0 h-[3px] bg-danger" />
        </div>
        <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-7">
          <h3 className="mb-5 text-xl font-semibold text-text">
            <em>With</em> SolAI
          </h3>
          {comparisonData.with.map((text) => (
            <CompareRow key={text} text={text} type="with" />
          ))}
          <div className="absolute right-0 bottom-0 left-0 h-[3px] bg-success" />
        </div>
      </ScrollReveal>
    </section>
  );
}
