import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { StepCard } from "@/components/molecules/StepCard";
import { howItWorksKeys, howItWorksSteps } from "@/data/how-it-works";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export async function HowItWorks() {
  const t = await getTranslations();

  return (
    <section id="how" className="section-y">
      <div className="mx-auto max-w-[1180px] px-[1.15rem] md:px-8">
        <Eyebrow>{t(howItWorksKeys.eyebrowKey)}</Eyebrow>
        <ScrollReveal>
          <Heading level={2} size="h2" className="mt-3 max-w-[20ch]">
            {t(howItWorksKeys.titleKey)}{" "}
            <span className="underline decoration-sun/45 decoration-[38%] underline-offset-[2px]">
              {t(howItWorksKeys.titleMarkKey)}
            </span>
          </Heading>
        </ScrollReveal>
        <ScrollReveal>
          <Text size="body-large" className="mb-8 mt-3 max-w-[60ch]">
            {t(howItWorksKeys.ledeKey)}
          </Text>
        </ScrollReveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {howItWorksSteps.map((step, i) => (
            <ScrollReveal key={step.id} delayClass={i ? `hero-enter-delay-${i}` : undefined}>
              <StepCard
                number={step.number}
                title={t(step.titleKey)}
                body={t(step.bodyKey)}
                timeLabel={t(step.timeKey)}
              />
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal>
          <div className="mt-5 rounded-card bg-paper-2 p-[1.15rem]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Text size="small" className="max-w-[52ch]">
                <span className="font-bold text-ink">{t(howItWorksKeys.calloutStrongKey)}</span>
                {t(howItWorksKeys.calloutKey)}
              </Text>
              <ActionButton asChild variant="sun">
                <Link href="#start">
                  {t(howItWorksKeys.ctaKey)}
                  <Icon name="arrowRight" size="sm" />
                </Link>
              </ActionButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
