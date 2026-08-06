import { getTranslations } from "next-intl/server";
import { AnnouncementBar } from "@/components/organisms/AnnouncementBar";
import { SiteHeader } from "@/components/organisms/SiteHeader";
import { Hero } from "@/components/organisms/Hero";
import { ProofStrip } from "@/components/organisms/ProofStrip";
import { HowItWorks } from "@/components/organisms/HowItWorks";
import { ProtectionSection } from "@/components/organisms/ProtectionSection";
import { WhatsAppSection } from "@/components/organisms/WhatsAppSection";
import { BuiltForHere } from "@/components/organisms/BuiltForHere";
import { PricingSection } from "@/components/organisms/PricingSection";
import { BuyerBand } from "@/components/organisms/BuyerBand";
import { SellerStories } from "@/components/organisms/SellerStories";
import { FaqSection } from "@/components/organisms/FaqSection";
import { FinalCta } from "@/components/organisms/FinalCta";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { announcement, mainNav } from "@/data/navigation";

export async function LandingTemplate() {
  const t = await getTranslations();
  const navLabels = Object.fromEntries(
    mainNav.map((item) => [item.labelKey, t(item.labelKey)]),
  );

  return (
    <>
      <AnnouncementBar
        highlight={t(announcement.highlightKey)}
        message={t(announcement.messageKey)}
        dismissLabel={t("common.dismissAnnouncement")}
      />
      <SiteHeader
        nav={mainNav}
        labels={navLabels}
        startFreeLabel={t("common.startFree")}
        languageLabel={t("common.languageGroup")}
        openMenuLabel={t("common.openMenu")}
        closeMenuLabel={t("common.closeMenu")}
        mainNavLabel={t("common.mainNav")}
        mobileNavLabel={t("common.mobileNav")}
      />
      <main>
        <Hero />
        <ProofStrip />
        <HowItWorks />
        <ProtectionSection />
        <WhatsAppSection />
        <BuiltForHere />
        <PricingSection />
        <BuyerBand />
        <SellerStories />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
