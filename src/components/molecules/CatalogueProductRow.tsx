"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { saveProductAction } from "@/app/actions/dashboard/product";
import { MoneyDisplay } from "@/components/atoms/Money";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { useToastContext } from "@/components/providers/ToastProvider";
import { isProductOnSale } from "@/lib/dashboard/derive";
import { cn } from "@/lib/cn";
import type { DashboardProduct } from "@/types/dashboard";

type CatalogueProductRowProps = {
  product: DashboardProduct;
};

/** Live/oos count as on-sale in the catalogue; draft is off. */
export function CatalogueProductRow({ product }: CatalogueProductRowProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToastContext();
  const [pending, startTransition] = useTransition();
  const onSale = isProductOnSale(product.status);

  const toggle = () => {
    const next = !onSale;
    startTransition(async () => {
      const result = await saveProductAction({
        id: product.id,
        name: product.name,
        priceMinor: product.price.amountMinor,
        stock: product.stock,
        description: product.description,
        onSale: next,
      });
      if (!result.ok) {
        toast(t("products.save.failed"));
        return;
      }
      toast(
        result.product.status === "draft"
          ? t("products.save.draft")
          : result.product.status === "oos"
            ? t("products.save.oos")
            : t("products.save.live"),
      );
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2.5 px-1 py-2.5">
      <ProductThumb
        palette={product.palette}
        beadCount={11}
        size="sm"
        className="size-[38px] rounded-[9px]"
        gradientId={`catalogue-${product.id}`}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.91rem] font-bold text-ink">
          {product.name}
        </span>
        <MoneyDisplay
          value={product.price}
          locale={locale}
          className="text-[0.73rem] font-semibold text-ink-45"
        />
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={onSale}
        aria-label={t("grow.catalogueToggle", { name: product.name })}
        disabled={pending}
        onClick={toggle}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          onSale ? "bg-sea" : "bg-ink-20",
          pending && "opacity-50",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform",
            onSale && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}
