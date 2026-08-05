import { setRequestLocale } from "next-intl/server";
import { CatalogueView } from "@/components/organisms/CatalogueView";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function GrowPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getDashboardService().getProducts();
  return <CatalogueView products={products} />;
}
