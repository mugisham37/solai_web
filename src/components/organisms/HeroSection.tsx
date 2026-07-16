import { SectionLabel } from "@/components/atoms/SectionLabel";
import { FadeIn } from "@/components/atoms/FadeIn";
import { MarketingButton } from "@/components/molecules/MarketingButton";
import { heroData } from "@/lib/data/hero";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
      <FadeIn className="order-2 md:order-1">
        <SectionLabel>{heroData.label}</SectionLabel>
        <h1 className="mb-5 text-[clamp(32px,5vw,52px)] leading-[1.15] font-bold tracking-[-0.03em] text-text">
          {heroData.titleLine1}
          <br />
          SolAI runs <em>{heroData.titleEmphasis}</em> else.
        </h1>
        <p className="mb-7 max-w-[520px] text-[clamp(16px,1.8vw,18px)] leading-relaxed text-text-muted">
          {heroData.subhead}
        </p>
        <div className="mb-7 flex flex-wrap gap-3">
          <MarketingButton href="/signup" variant="cta" size="lg">
            {heroData.primaryCta}
          </MarketingButton>
          <MarketingButton href="/contact" variant="secondary" size="lg">
            {heroData.secondaryCta}
          </MarketingButton>
        </div>
        <div className="flex flex-col gap-1 text-[13px] text-text-subtle">
          <span>{heroData.trustPrefix}</span>
          <span className="text-text-muted">{heroData.trustFlags}</span>
        </div>
      </FadeIn>
      <FadeIn className="order-1 md:order-2" delay={0.15}>
        <div className="relative mx-auto aspect-[1/0.85] w-full max-w-[440px]">
          {heroData.layers.map((layer, i) => (
            <div
              key={layer.label}
              className={cn(
                "absolute flex items-end rounded-lg border px-4 py-3 backdrop-blur-sm",
                i === 0 &&
                  "top-0 left-[10%] z-30 h-[35%] w-[80%] border-warning/30 bg-warning/8 [transform:perspective(600px)_rotateX(8deg)]",
                i === 1 &&
                  "top-[25%] left-[5%] z-20 h-[35%] w-[80%] border-brand/30 bg-brand/8 [transform:perspective(600px)_rotateX(8deg)]",
                i === 2 &&
                  "top-1/2 left-[12%] z-10 h-[35%] w-[80%] border-success/30 bg-success/8 [transform:perspective(600px)_rotateX(8deg)]",
              )}
            >
              <span
                className={cn(
                  "font-mono text-[11px] font-medium tracking-[0.06em] uppercase",
                  layer.variant === "warning" && "text-warning",
                  layer.variant === "brand" && "text-brand",
                  layer.variant === "success" && "text-success",
                )}
              >
                {layer.label}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
