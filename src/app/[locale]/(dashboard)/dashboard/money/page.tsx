import { setRequestLocale } from "next-intl/server";
import { MoneyView } from "@/components/organisms/MoneyView";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MoneyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const money = await getDashboardService().getMoneySnapshot();
  return <MoneyView money={money} />;
}
