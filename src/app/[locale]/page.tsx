import { setRequestLocale } from "next-intl/server";
import { LandingTemplate } from "@/components/templates/LandingTemplate";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingTemplate />;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
