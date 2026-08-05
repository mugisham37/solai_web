import { setRequestLocale } from "next-intl/server";
import { PlansView } from "@/components/organisms/PlansView";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PlansPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const dashboard = getDashboardService();
  const [money, orders] = await Promise.all([
    dashboard.getMoneySnapshot(),
    dashboard.getOrders({ filter: "paid", pageSize: 1 }),
  ]);

  return <PlansView money={money} paidCount={orders.counts.paid} />;
}
