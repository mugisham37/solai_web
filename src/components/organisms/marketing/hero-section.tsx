import { CountryFlag } from "@/components/atoms/country-flag";
import { CtaButtonLink } from "@/components/atoms/cta-button-link";
import { Emphasis } from "@/components/atoms/emphasis";
import { SectionLabel } from "@/components/atoms/section-label";
import { HeroVisual } from "@/components/molecules/hero-visual";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { HERO_CONTENT, HERO_LAYERS } from "@/data/marketing/hero";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-4 py-12 sm:px-8 md:grid-cols-2 md:gap-16 md:py-20">
      <StaggerGroup className="order-2 flex flex-col md:order-1" stagger={0.1}>
        <SectionLabel>{HERO_CONTENT.eyebrow}</SectionLabel>
        <h1 className="mb-5 text-[clamp(32px,5vw,52px)] leading-[1.15] font-bold tracking-[-0.03em] text-text">
          {HERO_CONTENT.titleLine1}
          <br />
          {HERO_CONTENT.titleLine2Before}
          <Emphasis>{HERO_CONTENT.titleEmphasis}</Emphasis>
          {HERO_CONTENT.titleLine2After}
        </h1>
        <p className="mb-7 max-w-[520px] text-[clamp(16px,1.8vw,18px)] leading-relaxed text-text-muted">
          {HERO_CONTENT.subCopy}
        </p>
        <div className="mb-7 flex flex-wrap gap-3">
          <CtaButtonLink cta={HERO_CONTENT.primaryCta} variant="cta" size="lg" />
          <CtaButtonLink cta={HERO_CONTENT.secondaryCta} variant="secondary" size="lg" />
        </div>
        <div className="flex flex-col gap-1 text-[13px] text-text-subtle">
          <span>{HERO_CONTENT.trustLine}</span>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-text-muted">
            {HERO_CONTENT.trustCountries.map((country, index) => (
              <span key={country.code} className="inline-flex items-center gap-1.5">
                {index > 0 && (
                  <span aria-hidden="true" className="text-text-subtle">
                    ·
                  </span>
                )}
                <CountryFlag country={country} />
                {country.name}
              </span>
            ))}
          </div>
        </div>
      </StaggerGroup>

      <div className="order-1 md:order-2">
        <HeroVisual layers={HERO_LAYERS} />
      </div>
    </section>
  );
}
