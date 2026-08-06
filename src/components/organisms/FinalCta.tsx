import { getTranslations } from "next-intl/server";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { StartInput } from "@/components/molecules/StartInput";
import { finalCtaKeys } from "@/data/final-cta";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export async function FinalCta() {
  const t = await getTranslations();

  return (
    <section className="section-y bg-[radial-gradient(120%_120%_at_80%_0%,var(--color-mid),var(--color-deep)_65%)] text-on-deep">
      <div className="mx-auto max-w-[1180px] px-[1.15rem] text-center md:px-8">
        <ScrollReveal>
          <Heading level={2} size="display" surface="dark" className="mx-auto max-w-[14ch]">
            {t.rich(finalCtaKeys.titleKey, {
              br: () => <br />,
            })}
          </Heading>
        </ScrollReveal>
        <ScrollReveal>
          <Text size="body-large" surface="dark" className="mx-auto mt-3 max-w-[46ch]">
            {t(finalCtaKeys.ledeKey)}
          </Text>
        </ScrollReveal>
        <ScrollReveal>
          <div className="mx-auto mt-6 max-w-[520px]">
            <StartInput
              size="large"
              submitLabel={t(finalCtaKeys.startKey)}
              cameraLabel={t("common.takePhoto")}
              label={t(finalCtaKeys.inputLabelKey)}
              placeholderSeed={t(finalCtaKeys.placeholderKey)}
              id="final-start"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <Text size="tiny" surface="dark" className="mt-4">
            {t(finalCtaKeys.footnoteKey)}
          </Text>
        </ScrollReveal>
      </div>
    </section>
  );
}
