import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/organisms/ProductEditor";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string; productId: string }>;
};

export default async function ProductEditorPage({ params }: PageProps) {
  const { locale, productId } = await params;
  setRequestLocale(locale);

  const dashboard = getDashboardService();
  const [product, shop] = await Promise.all([
    dashboard.getProduct(productId),
    dashboard.getShop(),
  ]);

  if (!product) notFound();

  return <ProductEditor product={product} shop={shop} />;
}
