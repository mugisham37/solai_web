import { MarketingButton } from "@/components/molecules/MarketingButton";

export function CTASection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-20 text-center md:px-8">
      <h2 className="mb-4 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
        Ready to let SolAI run your growth?
      </h2>
      <p className="mx-auto mb-6 max-w-[560px] text-[clamp(16px,1.8vw,18px)] text-text-muted">
        Upload your first product. Set a cap. Walk away. Revenue starts flowing.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <MarketingButton href="/signup" variant="cta" size="lg">
          Start free
        </MarketingButton>
        <MarketingButton href="/contact" variant="secondary" size="lg">
          Talk to us
        </MarketingButton>
      </div>
    </section>
  );
}
