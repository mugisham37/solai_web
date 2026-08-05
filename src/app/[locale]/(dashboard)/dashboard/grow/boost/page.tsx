import { setRequestLocale } from "next-intl/server";
import { BoostView } from "@/components/organisms/BoostView";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ productId?: string }>;
};

export default async function BoostPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { productId } = await searchParams;
  setRequestLocale(locale);

  const dashboard = getDashboardService();
  const [shop, products] = await Promise.all([
    dashboard.getShop(),
    dashboard.getProducts(),
  ]);
  const liveProducts = products.filter((p) => p.status === "live");

  return (
    <BoostView
      shop={shop}
      liveProducts={liveProducts}
      initialProductId={productId}
    />
  );
}
