import { getLocale, getTranslations } from "next-intl/server";
import { Chip } from "@/components/atoms/Chip";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ShopCard } from "@/components/art/ShopCard";
import { HeroStartGroup } from "@/components/molecules/HeroStartGroup";
import { TrustTile } from "@/components/molecules/TrustTile";
import { heroContentKeys, heroShop, heroTrustTiles } from "@/data/hero";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export async function Hero() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_15%_-10%,var(--color-mid),var(--color-deep)_62%)] text-on-deep"
    >
      <span className="pointer-events-none absolute -right-20 -top-[120px] size-[340px] rounded-full bg-hero-orb opacity-50 blur-[60px]" />
      <span className="pointer-events-none absolute -bottom-[140px] -left-[90px] size-[260px] rounded-full bg-sun/40 opacity-50 blur-[60px]" />
      <div className="relative z-[2] mx-auto max-w-[1180px] px-[1.15rem] pb-12 pt-6 md:px-8 lg:grid lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-14 lg:pb-20 lg:pt-10">
        <div className="flex flex-col gap-6">
          <ScrollReveal>
            <Chip variant="sun" className="w-fit hero-enter">
              {t(heroContentKeys.chipKey)}
            </Chip>
          </ScrollReveal>
          <ScrollReveal>
            <Heading level={1} size="display" surface="dark" className="hero-enter hero-enter-delay-1">
              {t.rich(heroContentKeys.headlineKey, {
                highlight: (chunks) => <span className="text-sun">{chunks}</span>,
                br: () => <br />,
              })}
            </Heading>
          </ScrollReveal>
          <ScrollReveal>
            <Text size="body-large" surface="dark" className="max-w-[48ch] hero-enter hero-enter-delay-2">
              {t(heroContentKeys.sublineKey)}
            </Text>
          </ScrollReveal>
          <ScrollReveal>
            <div id="start" className="hero-enter hero-enter-delay-3">
              <HeroStartGroup
                sellQuestion={t(heroContentKeys.sellQuestionKey)}
                startLabel={t(heroContentKeys.startButtonKey)}
                cameraLabel={t("common.takePhoto")}
                readsAsLabel={t(heroContentKeys.readsAsKey)}
                categoryHint={t(heroContentKeys.categoryHintKey)}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="grid grid-cols-3 gap-2 hero-enter hero-enter-delay-4">
              {heroTrustTiles.map((tile) => (
                <TrustTile key={tile.id} icon={tile.icon} label={t(tile.labelKey)} />
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <Text size="tiny" surface="dark" className="hero-enter hero-enter-delay-4">
              {t(heroContentKeys.footnoteKey)}
            </Text>
          </ScrollReveal>
        </div>
        <ScrollReveal className="mt-10 hidden min-[700px]:block lg:mt-0">
          <div aria-hidden className="mt-10 lg:mt-0">
            <ShopCard
              statusLabel={t(heroShop.statusKey)}
              shopSlug={heroShop.shopSlug}
              productTitle={t(heroShop.productTitleKey)}
              productMeta={t(heroShop.productMetaKey)}
              price={heroShop.price}
              locale={locale}
              flowCurrent={heroShop.flowCurrent}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
