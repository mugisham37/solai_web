import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { QuoteCard } from "@/components/molecules/QuoteCard";
import { sellerQuotes, sellerStoriesKeys } from "@/data/seller-stories";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export async function SellerStories() {
  const t = await getTranslations();

  return (
    <section className="pb-0 pt-0 section-y">
      <div className="mx-auto max-w-[1180px] px-[1.15rem] md:px-8">
        <Eyebrow>{t(sellerStoriesKeys.eyebrowKey)}</Eyebrow>
        <Heading level={2} size="h2" className="mt-3 mb-6 max-w-[20ch]">
          {t(sellerStoriesKeys.titleKey)}
        </Heading>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sellerQuotes.map((quote, i) => (
            <ScrollReveal key={quote.id} delayClass={i ? `hero-enter-delay-${i}` : undefined}>
              <QuoteCard
                quote={t(quote.quoteKey)}
                initials={quote.initials}
                name={t(quote.nameKey)}
                trade={t(quote.tradeKey)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
