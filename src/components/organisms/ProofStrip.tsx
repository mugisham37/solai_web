import { getTranslations } from "next-intl/server";
import { StatBlock } from "@/components/molecules/StatBlock";
import { Text } from "@/components/atoms/Text";
import { proofCitiesKey, proofStats } from "@/data/proof";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export async function ProofStrip() {
  const t = await getTranslations();

  return (
    <section className="border-t border-deep-hair bg-deep text-on-deep">
      <div className="mx-auto max-w-[1180px] px-[1.15rem] py-6 md:px-8">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {proofStats.map((stat, index) => (
            <ScrollReveal key={stat.id} delayClass={index ? `hero-enter-delay-${Math.min(index, 4)}` : undefined}>
              {stat.type === "money" ? (
                <StatBlock
                  target={stat.count ?? 0}
                  suffix={stat.suffix}
                  prefix="RWF "
                  label={t(stat.labelKey)}
                />
              ) : stat.type === "time" ? (
                <StatBlock
                  target={stat.count ?? 0}
                  suffix="m"
                  secondTarget={stat.secondCount}
                  secondSuffix="s"
                  label={t(stat.labelKey)}
                />
              ) : (
                <StatBlock
                  target={stat.count ?? 0}
                  suffix={stat.suffix ?? ""}
                  label={t(stat.labelKey)}
                />
              )}
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <Text size="tiny" surface="dark" className="mt-4">
            {t(proofCitiesKey)}
          </Text>
        </ScrollReveal>
      </div>
    </section>
  );
}
