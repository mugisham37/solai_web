import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/atoms/Logo";
import { Text } from "@/components/atoms/Text";
import { FooterLinkGroup } from "@/components/molecules/FooterLinkGroup";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher";
import { Separator } from "@/components/ui/separator";
import { footerGroups, footerKeys } from "@/data/footer";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="bg-deep text-on-deep">
      <div className="section-y mx-auto max-w-[1180px] px-[1.15rem] pb-8 pt-10 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo href="#top" className="mb-3" />
            <Text size="tiny" surface="dark" className="max-w-[34ch]">
              {t(footerKeys.blurbKey)}
            </Text>
            <LanguageSwitcher className="mt-4 w-fit" ariaLabel={t("common.languageGroup")} />
          </div>
          {footerGroups.map((group) => (
            <FooterLinkGroup
              key={group.id}
              title={t(group.titleKey)}
              links={group.links.map((link) => ({
                id: link.id,
                href: link.href,
                label: t(link.labelKey),
              }))}
            />
          ))}
        </div>
        <Separator onDark className="my-7" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Text size="tiny" surface="dark">
            {t(footerKeys.copyrightKey)}
          </Text>
          <Text size="tiny" surface="dark">
            {t(footerKeys.citiesKey)}
          </Text>
        </div>
      </div>
    </footer>
  );
}
