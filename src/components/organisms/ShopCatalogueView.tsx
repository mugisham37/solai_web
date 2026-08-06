"use client";

import { useLocale, useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { StatusChip } from "@/components/atoms/StatusChip";
import { BuyerProductCard } from "@/components/molecules/BuyerProductCard";
import { formatMoney } from "@/lib/money";
import { productPublicPath } from "@/lib/buyer";
import type { BuyerCatalogueItem, BuyerShop } from "@/types/buyer";
import { cn } from "@/lib/cn";

type ShopCatalogueViewProps = {
  shop: BuyerShop;
  catalogue: readonly BuyerCatalogueItem[];
  liveCount: number;
  onAsk: () => void;
  onShare: () => void;
  className?: string;
};

export function ShopCatalogueView({
  shop,
  catalogue,
  liveCount,
  onAsk,
  onShare,
  className,
}: ShopCatalogueViewProps) {
  const t = useTranslations("storefront");
  const locale = useLocale();

  return (
    <div className={cn("flex flex-col gap-4 px-3.5 pt-4 pb-8 @[700px]:px-6 @[700px]:pt-6", className)}>
      <div className="rounded-card bg-deep p-4 text-on-deep">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sun text-[0.78rem] font-bold text-sun-ink">
            {shop.seller.initials}
          </span>
          <div className="flex-1">
            <p className="font-display text-d2 font-extrabold uppercase text-on-deep">
              {shop.name}
            </p>
            <p className="text-[0.74rem] text-on-deep-30">
              {t("shopMeta", {
                city: shop.city,
                delivered: shop.seller.deliveredLabel,
                ships: shop.seller.shipsLabel.toLowerCase(),
              })}
            </p>
          </div>
          <StatusChip label={t("shopOpen")} tone="live" />
        </div>
        <p className="mt-3 text-[0.96rem] leading-relaxed text-on-deep-60">{shop.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton type="button" variant="whatsapp" size="sm" onClick={onAsk}>
            <Icon name="whatsapp" size="md" />
            {t("askAria")}
          </ActionButton>
          <ActionButton type="button" variant="line" size="sm" onDark onClick={onShare}>
            <Icon name="share" size="md" />
            {t("shareShop")}
          </ActionButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-eyebrow text-ink-45">{t("catalogueEyebrow", { count: liveCount })}</p>
        <span className="text-[0.74rem] text-ink-45">
          {t("catalogueHint", {
            currency: shop.currency,
            from: formatMoney(shop.deliveryFrom, locale),
          })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 @[700px]:grid-cols-3">
        {catalogue.map((item) => (
          <BuyerProductCard
            key={item.id}
            item={item}
            href={productPublicPath(shop.slug, item.id)}
            locale={locale}
            inStockLabel={t("inStock")}
            soldOutLabel={t("soldOut")}
          />
        ))}
      </div>

      <div className="flex gap-2 rounded-xl bg-sea/15 p-3 text-[0.81rem] leading-relaxed text-sea-muted">
        <Icon name="shield" size="md" className="mt-0.5 shrink-0" />
        <span>{t("shopEscrowNote")}</span>
      </div>
    </div>
  );
}
