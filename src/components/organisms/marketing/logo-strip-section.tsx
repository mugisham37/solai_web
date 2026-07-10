import { SectionLabel } from "@/components/atoms/section-label";
import { LogoChip } from "@/components/molecules/logo-chip";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { INTEGRATION_LOGOS } from "@/data/marketing/logos";

export function LogoStripSection() {
  return (
    <section className="mx-auto max-w-[1280px] border-b border-border px-4 py-8 sm:px-8">
      <SectionLabel className="mb-0">Built for sellers on</SectionLabel>
      <StaggerGroup className="mt-3 flex flex-wrap gap-2" stagger={0.04}>
        {INTEGRATION_LOGOS.map((logo) => (
          <LogoChip key={logo.name} logo={logo} />
        ))}
      </StaggerGroup>
    </section>
  );
}
