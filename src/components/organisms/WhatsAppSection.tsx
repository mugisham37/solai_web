import { getTranslations, getLocale } from "next-intl/server";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { ActionButton } from "@/components/atoms/ActionButton";
import { ChatMock } from "@/components/art/ChatMock";
import { Link } from "@/i18n/navigation";
import { whatsAppBullets, whatsAppChat, whatsAppSectionKeys } from "@/data/whatsapp";
import { formatMoney } from "@/lib/money";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export async function WhatsAppSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const priceLabel = formatMoney(whatsAppChat.productPrice, locale);

  return (
    <section id="whatsapp" className="section-y">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-[1.15rem] md:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>{t(whatsAppSectionKeys.eyebrowKey)}</Eyebrow>
          <Heading level={2} size="h2" className="mt-3 max-w-[16ch]">
            {t(whatsAppSectionKeys.titleKey)}{" "}
            <span className="underline decoration-sun/45 decoration-[38%] underline-offset-[2px]">
              {t(whatsAppSectionKeys.titleMarkKey)}
            </span>
          </Heading>
          <Text size="body-large" className="mt-3 max-w-[50ch]">
            {t(whatsAppSectionKeys.ledeKey)}
          </Text>
          <div className="mt-5 flex flex-col gap-4">
            {whatsAppBullets.map((bullet) => (
              <ScrollReveal key={bullet.id}>
                <div className="flex gap-3">
                  <IconTile variant="sea">
                    <Icon name="check" />
                  </IconTile>
                  <Text size="small">
                    <span className="font-bold text-ink">{t(bullet.titleKey)}</span>{" "}
                    {t(bullet.bodyKey)}
                  </Text>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ActionButton asChild variant="whatsapp" className="mt-5">
            <Link href="#start">
              <Icon name="whatsapp" />
              {t(whatsAppSectionKeys.ctaKey)}
            </Link>
          </ActionButton>
        </div>
        <ScrollReveal>
          <ChatMock
            buyerMessage={t(whatsAppChat.buyerMessageKey)}
            sellerStrong={t(whatsAppChat.sellerStrongKey, { price: priceLabel })}
            sellerDetail={t(whatsAppChat.sellerDetailKey)}
            viewCatalogue={t(whatsAppChat.viewCatalogueKey)}
            buyNow={t(whatsAppChat.buyNowKey)}
            buyerReply={t(whatsAppChat.buyerReplyKey)}
            aiNote={t(whatsAppChat.aiNoteKey)}
            price={whatsAppChat.productPrice}
            locale={locale}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
