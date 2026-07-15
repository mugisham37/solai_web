import type { Metadata } from "next";
import { HeroSection } from "@/components/organisms/HeroSection";
import { LogoStrip } from "@/components/organisms/LogoStrip";
import { HowItWorksSection } from "@/components/organisms/HowItWorksSection";
import { WhyShowcaseSection } from "@/components/organisms/WhyShowcaseSection";
import { ComparisonSection } from "@/components/organisms/ComparisonSection";
import { StatsSection } from "@/components/organisms/StatsSection";
import { TestimonialsSection } from "@/components/organisms/TestimonialsSection";
import { FAQSection } from "@/components/organisms/FAQSection";
import { CTASection } from "@/components/organisms/CTASection";
import { landingStats } from "@/lib/data/stats";
import { faqItems } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Upload a product. SolAI runs everything else — Meta and Google ads, WhatsApp sales, Stripe and Mobile Money payments, with every decision explained.",
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <HeroSection />
      <LogoStrip />
      <HowItWorksSection />
      <WhyShowcaseSection />
      <ComparisonSection />
      <StatsSection stats={landingStats} />
      <TestimonialsSection />
      <FAQSection items={faqItems} />
      <CTASection />
    </div>
  );
}
