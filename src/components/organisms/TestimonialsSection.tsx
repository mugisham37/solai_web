import { SectionLabel } from "@/components/atoms/SectionLabel";
import { TestimonialCard } from "@/components/molecules/TestimonialCard";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { testimonials } from "@/lib/data/testimonials";

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
      <SectionLabel>Seller Stories</SectionLabel>
      <h2 className="mb-6 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
        Sellers who let SolAI run their growth.
      </h2>
      <ScrollReveal className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </ScrollReveal>
    </section>
  );
}
