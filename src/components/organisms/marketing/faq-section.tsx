import { SectionLabel } from "@/components/atoms/section-label";
import { FadeIn } from "@/components/motion/fade-in";
import { FaqAccordion } from "@/components/organisms/marketing/faq-accordion";

export function FaqSection() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 md:py-16">
        <SectionLabel>Questions</SectionLabel>
        <h2 className="mb-4 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
          Frequently asked.
        </h2>
        <FadeIn>
          <FaqAccordion />
        </FadeIn>
      </div>
    </section>
  );
}
