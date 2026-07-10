import { CtaButtonLink } from "@/components/atoms/cta-button-link";
import { FadeIn } from "@/components/motion/fade-in";
import { FINAL_CTA } from "@/data/marketing/final-cta";

export function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-8 md:py-20">
      <FadeIn className="flex flex-col items-center text-center">
        <h2 className="mb-4 max-w-[720px] text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
          {FINAL_CTA.heading}
        </h2>
        <p className="mb-6 max-w-[560px] text-[clamp(16px,1.8vw,18px)] text-text-muted">
          {FINAL_CTA.subCopy}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <CtaButtonLink cta={FINAL_CTA.primaryCta} variant="cta" size="lg" />
          <CtaButtonLink cta={FINAL_CTA.secondaryCta} variant="secondary" size="lg" />
        </div>
      </FadeIn>
    </section>
  );
}
