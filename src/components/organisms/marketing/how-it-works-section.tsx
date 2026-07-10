import { SectionLabel } from "@/components/atoms/section-label";
import { StepCard } from "@/components/molecules/step-card";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { STEPS } from "@/data/marketing/steps";

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 md:py-16">
      <SectionLabel>How It Works</SectionLabel>
      <h2 className="mb-4 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
        Five minutes in. A revenue engine out.
      </h2>
      <StaggerGroup
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        stagger={0.06}
      >
        {STEPS.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </StaggerGroup>
    </section>
  );
}
