import { SectionLabel } from "@/components/atoms/section-label";
import { TestimonialCard } from "@/components/molecules/testimonial-card";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { TESTIMONIALS } from "@/data/marketing/testimonials";

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 md:py-16">
      <SectionLabel>Seller Stories</SectionLabel>
      <h2 className="mb-4 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
        Sellers who let SolAI run their growth.
      </h2>
      <StaggerGroup className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3" stagger={0.1}>
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </StaggerGroup>
    </section>
  );
}
