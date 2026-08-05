import { setRequestLocale } from "next-intl/server";
import { SettingsView } from "@/components/organisms/SettingsView";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const shop = await getDashboardService().getShop();
  return <SettingsView shop={shop} />;
}
