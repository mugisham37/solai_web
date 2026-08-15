"use client";

import { useMemo, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createCheckoutSessionAction } from "@/app/actions/buyer/checkout-session";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Icon } from "@/components/atoms/Icon";
import { MoneyDisplay } from "@/components/atoms/Money";
import { StatusChip } from "@/components/atoms/StatusChip";
import { AreaSelect } from "@/components/molecules/AreaSelect";
import { PriceLedger } from "@/components/molecules/PriceLedger";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { StickyBuyBar } from "@/components/molecules/StickyBuyBar";
import { VariantChipGroup } from "@/components/molecules/VariantChipGroup";
import { EscrowTrustCard } from "@/components/organisms/EscrowTrustCard";
import { ProductGallery } from "@/components/organisms/ProductGallery";
import { RecentDeliveriesCard } from "@/components/organisms/RecentDeliveriesCard";
import { SellerRecordCard } from "@/components/organisms/SellerRecordCard";
import { BuyerFaqSheet } from "@/components/organisms/BuyerFaqSheet";
import { BuyerProtectionSheet } from "@/components/organisms/BuyerProtectionSheet";
import { ReportListingSheet } from "@/components/organisms/ReportListingSheet";
import { useToastContext } from "@/components/providers/ToastProvider";
import {
  calcLineTotal,
  defaultAreaId,
  findArea,
} from "@/lib/buyer";
import { formatMoney } from "@/lib/money";
import { useRouter } from "@/i18n/navigation";
import type { BuyerProduct, BuyerShop } from "@/types/buyer";
import { cn } from "@/lib/cn";

type StorefrontProductViewProps = {
  shop: BuyerShop;
  product: BuyerProduct;
  onAsk: () => void;
  className?: string;
};

export function StorefrontProductView({
  shop,
  product,
  onAsk,
  className,
}: StorefrontProductViewProps) {
  const t = useTranslations("storefront");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToastContext();
  const [variant, setVariant] = useState(product.variants[0] ?? "");
  const [qty, setQty] = useState(1);
  const [areaId, setAreaId] = useState(defaultAreaId(shop.deliveryAreas));
  const [protOpen, setProtOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const area = findArea(shop.deliveryAreas, areaId) ?? shop.deliveryAreas[0];
  const breakdown = useMemo(() => {
    const ship = area?.fee ?? { amountMinor: 0, currency: product.price.currency };
    return calcLineTotal(product.price, qty, ship);
  }, [product.price, qty, area]);

  const itemLabel =
    variant.length > 0
      ? t("itemLineVariant", {
          item: product.shortLabel,
          qty,
          variant,
        })
      : t("itemLine", { item: product.shortLabel, qty });

  const buy = () => {
    startTransition(async () => {
      const result = await createCheckoutSessionAction({
        slug: shop.slug,
        productId: product.id,
        variant,
        qty,
        areaId,
      });
      if (!result.ok) {
        toast(t("errorLede"));
        return;
      }
      router.push(result.checkoutPath);
    });
  };

  return (
    <>
      <div className={cn("flex flex-1 flex-col", className)}>
        <div className="flex flex-col gap-4 px-3.5 pt-4 pb-4 @[700px]:gap-5 @[700px]:px-6 @[700px]:pt-6 @[1000px]:pb-6">
          <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] @[1000px]:items-start @[1000px]:gap-8">
            <ProductGallery images={product.images} productId={product.id} />

            <div className="flex flex-col gap-4 @[1000px]:sticky @[1000px]:top-[4.6rem]">
              <div>
                <Eyebrow variant="quiet">{product.eyebrow}</Eyebrow>
                <h1 className="font-display text-d1 mt-1.5 font-extrabold uppercase">
                  {product.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <MoneyDisplay value={product.price} locale={locale} className="text-d2" />
                  <StatusChip
                    label={t("stock", { count: product.stock })}
                    tone="live"
                  />
                </div>
              </div>

              <p className="text-[0.96rem] leading-relaxed text-ink-70">
                {product.description}
              </p>

              {product.variants.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                    {t("colour")}
                  </span>
                  <VariantChipGroup
                    variants={product.variants}
                    value={variant}
                    onChange={setVariant}
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                    {t("howMany")}
                  </span>
                  <QuantityStepper
                    value={qty}
                    max={product.stock}
                    onChange={setQty}
                    label={t("qtyLabel")}
                    fewerLabel={t("qtyFewer")}
                    moreLabel={t("qtyMore")}
                  />
                </div>
                <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                  <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                    {t("deliverTo")}
                  </span>
                  <AreaSelect
                    areas={shop.deliveryAreas}
                    value={areaId}
                    onChange={setAreaId}
                    label={t("deliverTo")}
                    formatOption={(a) =>
                      a.fee.amountMinor === 0
                        ? t("areaPickup")
                        : t("areaFee", {
                            area: a.label,
                            fee: formatMoney(a.fee, locale),
                          })
                    }
                  />
                </div>
              </div>

              <PriceLedger
                locale={locale}
                footnote={breakdown.isPickup ? t("etaPickup") : t("etaDelivery")}
                rows={[
                  { label: itemLabel, value: breakdown.itemLine },
                  {
                    label: t("delivery"),
                    value: breakdown.isPickup ? t("free") : breakdown.ship,
                  },
                  { label: t("youPay"), value: breakdown.total, total: true },
                ]}
              />

              <EscrowTrustCard
                shopName={shop.name}
                onOpenProtection={() => setProtOpen(true)}
              />

              <SellerRecordCard
                shopName={shop.name}
                city={shop.city}
                seller={shop.seller}
                shopHref={`/${shop.slug}`}
              />

              <RecentDeliveriesCard deliveries={shop.recentDeliveries} />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-1 py-1 text-[0.83rem] font-semibold text-ink-45 hover:text-ink"
                  onClick={() => setFaqOpen(true)}
                >
                  <Icon name="info" size="sm" className="size-3.5" />
                  {t("faqLink")}
                </button>
                <span className="flex-1" />
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-1 py-1 text-[0.83rem] font-semibold text-ink-45 hover:text-ink"
                  onClick={() => setReportOpen(true)}
                >
                  <Icon name="flag" size="sm" className="size-3.5" />
                  {t("reportLink")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <StickyBuyBar
          total={breakdown.total}
          locale={locale}
          totalLabel={t("total")}
          askLabel={t("ask")}
          askAria={t("askAria")}
          buyLabel={t("buyNow")}
          onAsk={onAsk}
          onBuy={buy}
          buyPending={pending}
        />
      </div>

      <BuyerProtectionSheet
        open={protOpen}
        onOpenChange={setProtOpen}
        shopName={shop.name}
      />
      <BuyerFaqSheet open={faqOpen} onOpenChange={setFaqOpen} />
      <ReportListingSheet
        open={reportOpen}
        onOpenChange={setReportOpen}
        slug={shop.slug}
        productId={product.id}
      />
    </>
  );
}
