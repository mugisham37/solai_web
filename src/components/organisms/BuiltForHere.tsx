import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { builtForCards, builtForSectionKeys } from "@/data/built-for-here";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export async function BuiltForHere() {
  const t = await getTranslations();

  return (
    <section className="section-y bg-paper-2">
      <div className="mx-auto max-w-[1180px] px-[1.15rem] md:px-8">
        <Eyebrow>{t(builtForSectionKeys.eyebrowKey)}</Eyebrow>
        <Heading level={2} size="h2" className="mt-3 mb-7 max-w-[22ch]">
          {t(builtForSectionKeys.titleKey)}
        </Heading>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {builtForCards.map((card, i) => (
            <ScrollReveal key={card.id} delayClass={i ? `hero-enter-delay-${i}` : undefined}>
              <article className="rounded-card border border-hair bg-white p-[1.15rem]">
                <IconTile variant="sun">
                  <Icon name={card.icon} />
                </IconTile>
                <Heading level={3} size="h3" className="mt-3 mb-1.5 normal-case">
                  {t(card.titleKey)}
                </Heading>
                <Text size="small">{t(card.bodyKey)}</Text>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
