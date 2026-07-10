import { Emphasis } from "@/components/atoms/emphasis";
import { SectionLabel } from "@/components/atoms/section-label";
import { FadeIn } from "@/components/motion/fade-in";
import { WhyDemoCard } from "@/components/organisms/marketing/why-demo-card";

export function WhyShowcaseSection() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 md:py-16">
        <SectionLabel>Explainable AI</SectionLabel>
        <h2 className="mb-4 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
          Every number has a <Emphasis>“Why?”</Emphasis>
        </h2>
        <p className="mb-3 max-w-[640px] text-[clamp(16px,1.8vw,18px)] text-text-muted">
          SolAI doesn’t just act — it explains. Every budget shift, creative pick,
          audience change, and chat reply is logged with the reasoning behind it.
        </p>
        <FadeIn className="mt-6 flex justify-center">
          <WhyDemoCard />
        </FadeIn>
      </div>
    </section>
  );
}
