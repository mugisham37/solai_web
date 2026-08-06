import { setRequestLocale } from "next-intl/server";
import { EmptyState } from "@/components/atoms/EmptyState";
import { StorefrontTemplate } from "@/components/templates/StorefrontTemplate";
import { getBuyerService } from "@/lib/buyer";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string; slug: string; productId: string }>;
};

export default async function ProductStorefrontPage({ params }: PageProps) {
  const { locale, slug, productId } = await params;
  setRequestLocale(locale);

  const result = await getBuyerService().getProductOrGone(slug, productId);
  if (!result) {
    const t = await getTranslations("storefront");
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4">
        <EmptyState
          icon="store"
          title={t("notFoundTitle")}
          description={t("notFoundLede")}
        />
      </div>
    );
  }

  if (result.kind === "gone") {
    return (
      <StorefrontTemplate mode={{ kind: "gone", shop: result.shop }} />
    );
  }

  const { shop, product } = result.page;
  if (product.status === "oos" || product.stock <= 0) {
    return (
      <StorefrontTemplate mode={{ kind: "oos", shop, product }} />
    );
  }

  return (
    <StorefrontTemplate mode={{ kind: "product", shop, product }} />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, productId } = await params;
  const page = await getBuyerService().getProduct(slug, productId);
  if (!page) return {};
  return {
    title: `${page.product.title} — ${page.shop.name}`,
    description: page.product.description,
  };
}
