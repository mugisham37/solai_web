import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Chip } from "@/components/atoms/Chip";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { pricingChips, pricingLines, pricingSectionKeys } from "@/data/pricing";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export async function PricingSection() {
  const t = await getTranslations();

  return (
    <section id="pricing" className="section-y">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-[1.15rem] md:px-8 lg:grid-cols-2 lg:items-start">
        <div>
          <Eyebrow>{t(pricingSectionKeys.eyebrowKey)}</Eyebrow>
          <Heading level={2} size="h2" className="mt-3 max-w-[17ch]">
            {t(pricingSectionKeys.titleKey)}
          </Heading>
          <Text size="body-large" className="mt-3 max-w-[50ch]">
            {t(pricingSectionKeys.ledeKey)}
          </Text>
          <div className="mt-5 flex flex-wrap gap-2">
            {pricingChips.map((chip) => (
              <Chip key={chip.id} variant="line">
                {t(chip.labelKey)}
              </Chip>
            ))}
          </div>
        </div>
        <ScrollReveal>
          <article className="rounded-card border border-hair bg-white p-[1.15rem]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Eyebrow variant="quiet">{t(pricingSectionKeys.planNameKey)}</Eyebrow>
                <p className="font-display text-[2.1rem] font-extrabold uppercase leading-none">
                  {t(pricingSectionKeys.planPriceKey)}
                  <span className="text-tiny font-semibold normal-case">{t(pricingSectionKeys.planPerMonthKey)}</span>
                </p>
              </div>
              <Chip variant="sun">{t(pricingSectionKeys.planBadgeKey)}</Chip>
            </div>
            <Separator className="my-4" />
            <dl className="flex flex-col">
              {pricingLines.map((line) => (
                <div
                  key={line.id}
                  className={`flex justify-between gap-4 py-2 text-sm ${line.isTotal ? "mt-1 border-t border-ink-20 pt-3 font-bold" : "border-t border-dashed border-hair first:border-0"}`}
                >
                  <dt>{t(line.labelKey)}</dt>
                  <dd className="tabular-nums">{t(line.valueKey)}</dd>
                </div>
              ))}
            </dl>
            <Text size="tiny" className="mt-3">
              {t(pricingSectionKeys.footnoteKey)}
            </Text>
            <ActionButton asChild variant="sun" size="lg" block className="mt-4">
              <Link href="#start">{t(pricingSectionKeys.ctaKey)}</Link>
            </ActionButton>
          </article>
        </ScrollReveal>
      </div>
    </section>
  );
}
