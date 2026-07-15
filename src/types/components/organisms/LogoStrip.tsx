import { SectionLabel } from "@/components/atoms/SectionLabel";
import { LogoChip } from "@/components/molecules/LogoChip";
import { logos } from "@/lib/data/logos";

export function LogoStrip() {
  return (
    <section className="mx-auto max-w-[1280px] border-b border-border px-4 py-8 md:px-8">
      <SectionLabel>Built for sellers on</SectionLabel>
      <div className="mt-3 flex flex-wrap gap-2">
        {logos.map((logo) => (
          <LogoChip key={logo} label={logo} />
        ))}
      </div>
    </section>
  );
}
