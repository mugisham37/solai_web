"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { BeadedBracelet } from "@/components/art/BeadedBracelet";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Icon } from "@/components/atoms/Icon";
import { MoneyDisplay } from "@/components/atoms/Money";
import { StatusChip } from "@/components/atoms/StatusChip";
import { useToastContext } from "@/components/providers/ToastProvider";
import { notifyRestockAction } from "@/app/actions/buyer/notify-restock";
import { Link } from "@/i18n/navigation";
import type { BuyerProduct, BuyerShop } from "@/types/buyer";
import { cn } from "@/lib/cn";

type OutOfStockViewProps = {
  shop: BuyerShop;
  product: BuyerProduct;
  onAsk: () => void;
  className?: string;
};

export function OutOfStockView({
  shop,
  product,
  onAsk,
  className,
}: OutOfStockViewProps) {
  const t = useTranslations("storefront");
  const locale = useLocale();
  const { toast } = useToastContext();
  const [phone, setPhone] = useState("");
  const [bad, setBad] = useState(false);
  const [pending, startTransition] = useTransition();
  const image = product.images[0];

  const submit = () => {
    startTransition(async () => {
      const result = await notifyRestockAction({
        slug: shop.slug,
        productId: product.id,
        phoneDigits: phone,
      });
      if (!result.ok) {
        setBad(true);
        toast(t("notifyShort"));
        return;
      }
      setBad(false);
      toast(t("notifyOk"));
    });
  };

  return (
    <div className={cn("px-3.5 pt-4 pb-8 @[700px]:px-6 @[700px]:pt-6", className)}>
      <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] @[1000px]:gap-8">
        <div className="relative aspect-square overflow-hidden rounded-card bg-paper-2 opacity-55">
          {image ? (
            <BeadedBracelet
              paletteIndex={image.palette}
              beadCount={image.beads}
              gradientId={`oos-${product.id}`}
              className="size-full rounded-none"
              aspectClass="aspect-square h-full"
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-4 @[1000px]:sticky @[1000px]:top-[4.6rem]">
          <div>
            <Eyebrow variant="quiet">{product.eyebrow}</Eyebrow>
            <h1 className="font-display text-d1 mt-1.5 font-extrabold uppercase">{product.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <MoneyDisplay value={product.price} locale={locale} className="text-d2" />
              <StatusChip label={t("oosChip")} tone="clay" />
            </div>
          </div>
          <p className="text-[0.96rem] leading-relaxed text-ink-70">{product.description}</p>

          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-2 text-[0.92rem] font-bold">{t("notifyTitle")}</p>
            <label className="flex flex-col gap-1">
              <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                {t("notifyLabel")}
              </span>
              <span className="flex">
                <span className="rounded-l-xl border border-r-0 border-ink-20 bg-paper-2 px-2.5 py-3 text-[0.88rem] font-bold whitespace-nowrap">
                  {t("prefix")}
                </span>
                <input
                  inputMode="tel"
                  placeholder="788 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(
                    "w-full rounded-r-xl border border-ink-20 bg-white px-3 py-3 text-[0.95rem] outline-none focus:border-sun",
                    bad && "border-clay shadow-[0_0_0_3px_rgb(110_0_0_/_14%)]",
                  )}
                />
              </span>
              <span className="text-[0.72rem] text-ink-45">{t("notifyHint")}</span>
            </label>
            <ActionButton
              type="button"
              variant="sun"
              block
              className="mt-3"
              disabled={pending}
              onClick={submit}
            >
              {t("notifyCta")}
            </ActionButton>
          </div>

          <ActionButton type="button" variant="line" block onClick={onAsk}>
            <Icon name="whatsapp" size="md" />
            {t("askWhenBack", { name: shop.name.split(" ")[0] ?? shop.name })}
          </ActionButton>
          <ActionButton asChild variant="line" block>
            <Link href={`/${shop.slug}`}>
              {t("seeWhatElse", { name: shop.name.split(" ")[0] ?? shop.name })}
            </Link>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
