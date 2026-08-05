import { setRequestLocale } from "next-intl/server";
import { OrdersView } from "@/components/organisms/OrdersView";
import { getDashboardService } from "@/lib/dashboard";
import { parseOrdersSearchParams } from "@/lib/dashboard/orders-query";
import type { OrderFilter } from "@/types/dashboard";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string; q?: string; page?: string }>;
};

export default async function OrdersPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const query = parseOrdersSearchParams(sp);
  const filter = (query.filter ?? "all") as OrderFilter;

  const dashboard = getDashboardService();
  const [shop, result, products, money] = await Promise.all([
    dashboard.getShop(),
    dashboard.getOrders(query),
    dashboard.getProducts(),
    dashboard.getMoneySnapshot(),
  ]);

  return (
    <OrdersView
      shop={shop}
      result={result}
      products={products}
      filter={filter}
      heldBalance={money.heldBalance}
      query={query.q}
    />
  );
}
