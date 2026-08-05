import { setRequestLocale } from "next-intl/server";
import { ProductsView } from "@/components/organisms/ProductsView";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getDashboardService().getProducts();
  return <ProductsView products={products} />;
}
