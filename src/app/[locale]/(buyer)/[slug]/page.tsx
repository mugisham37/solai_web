import { setRequestLocale, getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/atoms/EmptyState";
import { StorefrontTemplate } from "@/components/templates/StorefrontTemplate";
import { getBuyerService } from "@/lib/buyer";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ShopStorefrontPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = await getBuyerService().getShopBySlug(slug);
  if (!page) {
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

  return (
    <StorefrontTemplate
      mode={{
        kind: "shop",
        shop: page.shop,
        catalogue: page.catalogue,
        liveCount: page.liveCount,
      }}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getBuyerService().getShopBySlug(slug);
  if (!page) return {};
  return {
    title: `${page.shop.name} — SolAI`,
    description: page.shop.tagline,
  };
}
