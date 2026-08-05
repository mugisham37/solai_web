"use client";

import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { FaqItem } from "@/components/molecules/FaqItem";
import { Accordion } from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";
import { faqItems, faqSectionKeys } from "@/data/faq";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export function FaqSection() {
  const t = useTranslations();

  return (
    <section className="pb-0 pt-0 section-y">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-[1.15rem] md:px-8 lg:grid-cols-2 lg:items-start">
        <div>
          <Eyebrow>{t(faqSectionKeys.eyebrowKey)}</Eyebrow>
          <Heading level={2} size="h2" className="mt-3">
            {t(faqSectionKeys.titleKey)}
          </Heading>
          <Text size="small" className="mt-3 max-w-[40ch]">
            {t(faqSectionKeys.ledeKey)}
          </Text>
          <ActionButton asChild variant="line" className="mt-4">
            <Link href="#start">
              <Icon name="whatsapp" />
              {t(faqSectionKeys.ctaKey)}
            </Link>
          </ActionButton>
        </div>
        <ScrollReveal>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <FaqItem
                key={item.id}
                id={item.id}
                question={t(item.questionKey)}
                answer={t(item.answerKey)}
              />
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
