import { ComparisonSection } from "@/components/organisms/marketing/comparison-section";
import { FaqSection } from "@/components/organisms/marketing/faq-section";
import { FinalCtaSection } from "@/components/organisms/marketing/final-cta-section";
import { HeroSection } from "@/components/organisms/marketing/hero-section";
import { HowItWorksSection } from "@/components/organisms/marketing/how-it-works-section";
import { LogoStripSection } from "@/components/organisms/marketing/logo-strip-section";
import { StatsSection } from "@/components/organisms/marketing/stats-section";
import { TestimonialsSection } from "@/components/organisms/marketing/testimonials-section";
import { WhyShowcaseSection } from "@/components/organisms/marketing/why-showcase-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <LogoStripSection />
      <HowItWorksSection />
      <WhyShowcaseSection />
      <ComparisonSection />
      <StatsSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
