import type { FooterGroupContent } from "@/types/landing";

export const footerGroups: readonly FooterGroupContent[] = [
  {
    id: "footer-product",
    titleKey: "footer.groups.product.title",
    links: [
      { id: "fl-how", href: "#how", labelKey: "footer.groups.product.how" },
      { id: "fl-protection", href: "#protection", labelKey: "footer.groups.product.protection" },
      { id: "fl-wa", href: "#whatsapp", labelKey: "footer.groups.product.whatsapp" },
      { id: "fl-pricing", href: "#pricing", labelKey: "footer.groups.product.pricing" },
    ],
  },
  {
    id: "footer-support",
    titleKey: "footer.groups.support.title",
    links: [
      { id: "fl-help", href: "#", labelKey: "footer.groups.support.help" },
      { id: "fl-dispute", href: "#", labelKey: "footer.groups.support.dispute" },
      { id: "fl-delivery", href: "#", labelKey: "footer.groups.support.delivery" },
      { id: "fl-contact", href: "#", labelKey: "footer.groups.support.contact" },
    ],
  },
  {
    id: "footer-company",
    titleKey: "footer.groups.company.title",
    links: [
      { id: "fl-about", href: "#", labelKey: "footer.groups.company.about" },
      { id: "fl-seller-terms", href: "#", labelKey: "footer.groups.company.sellerTerms" },
      { id: "fl-buyer-policy", href: "#", labelKey: "footer.groups.company.buyerPolicy" },
      { id: "fl-privacy", href: "#", labelKey: "footer.groups.company.privacy" },
    ],
  },
] as const;

export const footerKeys = {
  blurbKey: "footer.blurb",
  copyrightKey: "footer.copyright",
  citiesKey: "footer.cities",
} as const;
