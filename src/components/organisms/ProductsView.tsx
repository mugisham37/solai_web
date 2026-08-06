import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { ProductCard } from "@/components/molecules/ProductCard";
import { PRODUCT_STATUS } from "@/lib/dashboard/status";
import type { DashboardProduct } from "@/types/dashboard";

type ProductsViewProps = {
  products: readonly DashboardProduct[];
};

export async function ProductsView({ products }: ProductsViewProps) {
  const t = await getTranslations("dashboard");
  const locale = await getLocale();
  const liveCount = products.filter((p) => p.status === "live").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
            {t("titles.products")}
          </h1>
          <p className="mt-1 text-[0.73rem] text-ink-45">
            {t("products.subtitle", { total: products.length, live: liveCount })}
          </p>
        </div>
        <ActionButton asChild variant="sun" size="sm" className="hidden @[700px]:inline-flex">
          <Link href="/start">
            <Icon name="plus" size="sm" />
            {t("products.add")}
          </Link>
        </ActionButton>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 @[1000px]:grid-cols-3">
          {products.map((product) => {
            const meta = PRODUCT_STATUS[product.status];
            return (
              <ProductCard
                key={product.id}
                product={product}
                statusLabel={t(meta.labelKey)}
                statusTone={meta.tone as "live" | "clay" | "grey"}
                locale={locale}
                meta={t("products.cardMeta", {
                  views: product.views,
                  sold: product.sold,
                  stock: product.stock,
                })}
              />
            );
          })}
          <Link
            href="/start"
            className="grid min-h-[190px] place-items-center rounded-card border border-dashed border-ink-20 bg-white p-4 text-center transition-colors hover:bg-paper-2"
          >
            <span>
              <IconTile variant="sun" className="mx-auto mb-2.5">
                <Icon name="plus" />
              </IconTile>
              <span className="block text-[0.97rem] font-bold text-ink">
                {t("products.add")}
              </span>
              <span className="mt-1 block text-[0.73rem] text-ink-45">
                {t("products.addHint")}
              </span>
            </span>
          </Link>
        </div>
      ) : (
        <EmptyState
          icon="box"
          title={t("products.emptyTitle")}
          description={t("products.emptyLede")}
          action={
            <ActionButton asChild variant="sun" size="sm">
              <Link href="/start">{t("products.add")}</Link>
            </ActionButton>
          }
        />
      )}

      <div className="flex gap-2 rounded-tile border border-hair bg-paper-2 px-3.5 py-3 text-sm text-ink-70">
        <Icon name="info" size="md" className="mt-0.5 shrink-0 text-ink-45" />
        <p>{t("products.photoNote")}</p>
      </div>
    </div>
  );
}
