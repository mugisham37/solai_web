"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  saveProductAction,
} from "@/app/actions/dashboard/product";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { KpiCard } from "@/components/atoms/KpiCard";
import { MoneyDisplay } from "@/components/atoms/Money";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { StatusChip } from "@/components/atoms/StatusChip";
import { DeleteProductSheet } from "@/components/molecules/DeleteProductSheet";
import { SaleToggle } from "@/components/molecules/SaleToggle";
import { useToastContext } from "@/components/providers/ToastProvider";
import { isProductOnSale, resolveProductStatus } from "@/lib/dashboard/derive";
import { PRODUCT_STATUS } from "@/lib/dashboard/status";
import { formatMoney } from "@/lib/money";
import {
  productEditSchema,
  type ProductEditValues,
} from "@/lib/schemas/product-edit";
import { inAppProductPath } from "@/lib/buyer";
import type { DashboardProduct, DashboardShop } from "@/types/dashboard";

type ProductEditorProps = {
  product: DashboardProduct;
  shop: DashboardShop;
};

function previewStatus(
  stock: number,
  onSale: boolean,
): ReturnType<typeof resolveProductStatus> {
  return resolveProductStatus(stock, onSale);
}

export function ProductEditor({ product, shop }: ProductEditorProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToastContext();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<ProductEditValues>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      title: product.name,
      priceMinor: product.price.amountMinor,
      stock: product.stock,
      descriptionEn: product.description,
      onSale: isProductOnSale(product.status),
    },
  });

  const title = useWatch({ control: form.control, name: "title" }) ?? "";
  const priceMinor =
    useWatch({ control: form.control, name: "priceMinor" }) ?? 0;
  const stock = useWatch({ control: form.control, name: "stock" }) ?? 0;
  const onSale =
    useWatch({ control: form.control, name: "onSale" }) ?? true;
  const descriptionEn =
    useWatch({ control: form.control, name: "descriptionEn" }) ?? "";

  const nextStatus = previewStatus(stock, onSale);
  const statusMeta = PRODUCT_STATUS[nextStatus];
  const feePad = 355;
  const earnedMinor = Math.max(0, product.sold * (product.price.amountMinor - feePad));
  const conversion =
    product.views > 0 ? ((product.sold / product.views) * 100).toFixed(1) : "0.0";
  const buyerHref = inAppProductPath(shop.slug, product.id);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveProductAction({
        id: product.id,
        name: values.title,
        priceMinor: values.priceMinor,
        stock: values.stock,
        description: values.descriptionEn,
        onSale: values.onSale,
      });

      if (!result.ok) {
        toast(
          result.error === "validation"
            ? t("products.save.validation")
            : t("products.save.failed"),
        );
        return;
      }

      const status = result.product.status;
      toast(
        status === "oos"
          ? t("products.save.oos")
          : status === "draft"
            ? t("products.save.draft")
            : t("products.save.live"),
      );
      router.push("/dashboard/products");
      router.refresh();
    });
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
            {t("titles.product")}
          </h1>
          <p className="mt-1 text-[0.73rem] text-ink-45">{product.name}</p>
        </div>
        <ActionButton asChild variant="line" size="sm">
          <Link href={buyerHref}>
            <Icon name="eye" size="sm" />
            {t("products.viewAsBuyer")}
          </Link>
        </ActionButton>
      </div>

      <div className="grid gap-[1.1rem] @[1000px]:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] @[1000px]:items-start">
        <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
          <div className="rounded-card border border-hair bg-white p-4">
            <div className="flex items-start gap-3">
              <ProductThumb
                palette={product.palette}
                beadCount={14}
                size="md"
                gradientId={`product-edit-${product.id}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[0.73rem] text-ink-45">
                  {t("products.imagesNote")}
                </p>
                <ActionButton asChild variant="line" size="sm" className="mt-2">
                  <Link href="/start">
                    <Icon name="spark" size="sm" />
                    {t("products.changePictures")}
                  </Link>
                </ActionButton>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-card border border-hair bg-white p-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                {t("products.fields.name")}
              </span>
              <input
                className="min-h-11 w-full rounded-xl border border-ink-20 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
                maxLength={70}
                value={title}
                onChange={(e) =>
                  form.setValue("title", e.target.value, { shouldValidate: true })
                }
              />
              {form.formState.errors.title ? (
                <span className="text-[0.73rem] text-clay">
                  {t("products.fields.nameError")}
                </span>
              ) : null}
            </label>

            <div className="flex flex-col gap-3 @[560px]:flex-row @[560px]:items-end">
              <label className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                  {t("products.fields.price")}
                </span>
                <span className="flex min-h-11 overflow-hidden rounded-xl border border-ink-20">
                  <span className="grid place-items-center bg-paper-2 px-3 text-sm font-bold text-ink-45">
                    {shop.currency}
                  </span>
                  <input
                    className="min-w-0 flex-1 bg-white px-3 py-2.5 text-ink outline-none"
                    inputMode="numeric"
                    value={priceMinor || ""}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^\d]/g, "");
                      form.setValue(
                        "priceMinor",
                        digits ? Number.parseInt(digits, 10) : 0,
                        { shouldValidate: true },
                      );
                    }}
                  />
                </span>
                {form.formState.errors.priceMinor ? (
                  <span className="text-[0.73rem] text-clay">
                    {t("products.fields.priceError")}
                  </span>
                ) : null}
              </label>

              <label className="flex w-full flex-col gap-1.5 @[560px]:w-[38%]">
                <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                  {t("products.fields.stock")}
                </span>
                <input
                  className="min-h-11 w-full rounded-xl border border-ink-20 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
                  inputMode="numeric"
                  value={stock}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^\d]/g, "");
                    form.setValue(
                      "stock",
                      digits ? Number.parseInt(digits, 10) : 0,
                      { shouldValidate: true },
                    );
                  }}
                />
              </label>
            </div>

            {stock === 0 && onSale ? (
              <p className="rounded-tile border border-clay/25 bg-clay/5 px-3 py-2 text-[0.73rem] text-clay">
                {t("products.oosBanner")}
              </p>
            ) : null}

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                {t("products.fields.description")}
              </span>
              <textarea
                className="min-h-[7rem] w-full rounded-xl border border-ink-20 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
                value={descriptionEn}
                onChange={(e) =>
                  form.setValue("descriptionEn", e.target.value, {
                    shouldValidate: true,
                  })
                }
              />
              {form.formState.errors.descriptionEn ? (
                <span className="text-[0.73rem] text-clay">
                  {t("products.fields.descriptionError")}
                </span>
              ) : null}
            </label>

            <SaleToggle
              checked={onSale}
              onCheckedChange={(next) =>
                form.setValue("onSale", next, { shouldValidate: true })
              }
              title={t("products.onSale.title")}
              subtitle={t("products.onSale.subtitle")}
              label={t("products.onSale.aria")}
              disabled={pending}
            />

            <div className="flex flex-wrap items-center gap-2">
              <StatusChip
                tone={statusMeta.tone}
                label={t(statusMeta.labelKey)}
              />
              <span className="text-[0.73rem] text-ink-45">
                {t(`products.statusHint.${nextStatus}`)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <ActionButton type="submit" variant="sun" disabled={pending}>
                {pending ? t("products.save.saving") : t("products.save.cta")}
              </ActionButton>
              <ActionButton asChild variant="line">
                <Link href="/dashboard/products">{t("products.save.cancel")}</Link>
              </ActionButton>
              <span className="flex-1" />
              <ActionButton
                type="button"
                variant="plain"
                className="text-clay"
                onClick={() => setDeleteOpen(true)}
                aria-label={t("products.delete.confirmAria", {
                  name: product.name,
                })}
              >
                <Icon name="trash" size="sm" />
                {t("products.delete.cta")}
              </ActionButton>
            </div>
          </div>
        </form>

        <div className="flex flex-col gap-3.5 @[1000px]:sticky @[1000px]:top-20">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("products.statsTitle")}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <KpiCard
                label={t("products.stats.views")}
                value={product.views}
                locale={locale}
              />
              <KpiCard
                label={t("products.stats.sold")}
                value={product.sold}
                locale={locale}
              />
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-hair pt-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-45">{t("products.stats.earned")}</span>
                <MoneyDisplay
                  value={{ amountMinor: earnedMinor, currency: shop.currency }}
                  locale={locale}
                  className="font-bold text-ink"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-45">{t("products.stats.conversion")}</span>
                <span className="font-bold text-ink">{conversion}%</span>
              </div>
            </div>
          </div>

          <div className="rounded-card bg-paper-2 p-4">
            <p className="text-[0.91rem] font-bold text-ink">
              {t("products.priceCheck.title")}
            </p>
            <p className="mt-1 text-[0.73rem] text-ink-45">
              {t("products.priceCheck.lede", {
                city: shop.city,
                low: formatMoney(
                  { amountMinor: 6000, currency: shop.currency },
                  locale,
                ),
                high: formatMoney(
                  { amountMinor: 11000, currency: shop.currency },
                  locale,
                ),
              })}
            </p>
          </div>

          <ActionButton asChild variant="line" block>
            <Link href={`/dashboard/grow/boost?productId=${product.id}`}>
              <Icon name="megaphone" size="sm" />
              {t("products.boost")}
            </Link>
          </ActionButton>
        </div>
      </div>

      <DeleteProductSheet
        productId={product.id}
        productName={product.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
