import { SectionLabel } from "@/components/atoms/SectionLabel";
import { StepCard } from "@/components/molecules/StepCard";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { howItWorksSteps } from "@/lib/data/how-it-works";

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
      <SectionLabel>How It Works</SectionLabel>
      <h2 className="mb-4 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
        Five minutes in. A revenue engine out.
      </h2>
      <ScrollReveal className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {howItWorksSteps.map((step) => (
          <StepCard key={step.num} {...step} />
        ))}
      </ScrollReveal>
    </section>
  );
}
