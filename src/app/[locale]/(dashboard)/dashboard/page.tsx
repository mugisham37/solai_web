import { setRequestLocale } from "next-intl/server";
import { HomeView } from "@/components/organisms/HomeView";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardHomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const dashboard = getDashboardService();
  const [home, products] = await Promise.all([
    dashboard.getHomeSnapshot(),
    dashboard.getProducts(),
  ]);

  return <HomeView home={home} products={products} />;
}
