import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/atoms/Icon";
import { KpiCard } from "@/components/atoms/KpiCard";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { StatusChip } from "@/components/atoms/StatusChip";
import { CatalogueProductRow } from "@/components/molecules/CatalogueProductRow";
import { GrowTabs } from "@/components/molecules/GrowTabs";
import { ToggleRow } from "@/components/molecules/ToggleRow";
import { formatMoney } from "@/lib/money";
import type { DashboardProduct } from "@/types/dashboard";

type CatalogueViewProps = {
  products: readonly DashboardProduct[];
};

export async function CatalogueView({ products }: CatalogueViewProps) {
  const t = await getTranslations("dashboard");
  const locale = await getLocale();
  const featured = products[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
          {t("titles.grow")}
        </h1>
        <StatusChip tone="live" label={t("grow.published")} />
      </div>

      <GrowTabs />

      <div className="grid gap-[1.1rem] @[1000px]:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3.5">
          <div className="rounded-card bg-[#E7DDD2] p-[0.72rem]">
            <div className="flex flex-col gap-2.5">
              <div className="max-w-[82%] self-start rounded-[13px_13px_13px_4px] bg-white px-2.5 py-2">
                <p className="text-sm text-ink">{t("grow.chatBuyer")}</p>
              </div>
              <div className="w-[88%] self-end rounded-[13px_13px_4px_13px] bg-[#D7F3C4] p-2.5">
                {featured ? (
                  <>
                    <div className="mb-2 grid grid-cols-2 gap-1.5">
                      <ProductThumb
                        palette={featured.palette}
                        beadCount={12}
                        size="lg"
                        className="rounded-[9px]"
                        gradientId="grow-chat-a"
                      />
                      <ProductThumb
                        palette={products[1]?.palette ?? 1}
                        beadCount={13}
                        size="lg"
                        className="rounded-[9px]"
                        gradientId="grow-chat-b"
                      />
                    </div>
                    <p className="text-sm text-ink">
                      <span className="font-bold">
                        {featured.name} ·{" "}
                        {formatMoney(featured.price, locale)}
                      </span>
                      <br />
                      {t("grow.chatStock", { stock: featured.stock })}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatusChip tone="grey" label={t("grow.viewCatalogue")} />
                      <StatusChip tone="sun" label={t("grow.buyNow")} />
                    </div>
                  </>
                ) : null}
              </div>
              <p className="text-center text-[0.73rem] text-ink-45">
                {t("grow.answeredIn")}
              </p>
            </div>
          </div>

          <div className="rounded-card border border-hair bg-white px-3 py-1">
            <p className="px-1 pt-2 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("grow.answersTitle")}
            </p>
            <div className="divide-y divide-hair">
              <ToggleRow
                title={t("grow.answers.price.title")}
                subtitle={t("grow.answers.price.sub")}
                checked
                interactive={false}
              />
              <ToggleRow
                title={t("grow.answers.checkout.title")}
                subtitle={t("grow.answers.checkout.sub")}
                checked
                interactive={false}
              />
              <ToggleRow
                title={t("grow.answers.language.title")}
                subtitle={t("grow.answers.language.sub")}
                checked
                interactive={false}
              />
              <ToggleRow
                title={t("grow.answers.closed.title")}
                subtitle={t("grow.answers.closed.sub")}
                checked={false}
                interactive={false}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 @[1000px]:sticky @[1000px]:top-20">
          <div className="grid grid-cols-2 gap-2.5">
            <KpiCard label={t("grow.kpi.views")} value={184} locale={locale} />
            <KpiCard label={t("grow.kpi.chats")} value={27} locale={locale} />
          </div>

          <div className="rounded-card border border-hair bg-white px-3 py-2">
            <p className="px-1 pb-1 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("grow.inCatalogue")}
            </p>
            <div className="divide-y divide-hair">
              {products.map((product) => (
                <CatalogueProductRow key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="flex gap-2 rounded-tile border border-sea/25 bg-sea/5 px-3.5 py-3 text-sm text-ink-70">
            <Icon name="shield" size="md" className="mt-0.5 shrink-0 text-sea-muted" />
            <p>{t("grow.escrowNote")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
