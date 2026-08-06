import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { buyerBandKeys, buyerBullets } from "@/data/buyer-band";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export async function BuyerBand() {
  const t = await getTranslations();

  return (
    <section id="buyers" className="pb-0 pt-0 section-y">
      <div className="mx-auto max-w-[1180px] px-[1.15rem] md:px-8">
        <ScrollReveal>
          <div className="rounded-card bg-deep p-5 text-on-deep">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <Eyebrow variant="accent" onDark>
                  {t(buyerBandKeys.eyebrowKey)}
                </Eyebrow>
                <Heading level={2} size="h3" surface="dark" className="mt-2 text-[1.4rem] normal-case">
                  {t(buyerBandKeys.titleKey)}
                </Heading>
                <Text size="small" surface="dark" className="mt-2">
                  {t(buyerBandKeys.bodyKey)}
                </Text>
              </div>
              <div className="flex flex-col gap-3">
                {buyerBullets.map((bullet) => (
                  <div key={bullet.id} className="flex gap-3">
                    <IconTile variant="berry">
                      <Icon name={bullet.icon} />
                    </IconTile>
                    <Text size="small" surface="dark">
                      {t.rich(bullet.bodyKey, {
                        strong: (chunks) => <span className="font-bold text-on-deep">{chunks}</span>,
                      })}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
