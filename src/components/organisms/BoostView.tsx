"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { startBoostAction } from "@/app/actions/dashboard/boost";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { MoneyDisplay } from "@/components/atoms/Money";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { StatusChip } from "@/components/atoms/StatusChip";
import { GrowTabs } from "@/components/molecules/GrowTabs";
import { useToastContext } from "@/components/providers/ToastProvider";
import { formatMoney } from "@/lib/money";
import type { DashboardProduct, DashboardShop } from "@/types/dashboard";

type BoostViewProps = {
  shop: DashboardShop;
  liveProducts: readonly DashboardProduct[];
  initialProductId?: string;
};

export function BoostView({
  shop,
  liveProducts,
  initialProductId,
}: BoostViewProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToastContext();
  const [pending, startTransition] = useTransition();
  const [audience, setAudience] = useState(
    t("grow.boost.audienceDefault", { city: shop.city }),
  );
  const [budgetMinor, setBudgetMinor] = useState(5000);
  const [productId, setProductId] = useState(
    initialProductId && liveProducts.some((p) => p.id === initialProductId)
      ? initialProductId
      : (liveProducts[0]?.id ?? ""),
  );

  const start = () => {
    if (!productId || budgetMinor <= 0) {
      toast(t("grow.boost.validation"));
      return;
    }
    startTransition(async () => {
      const result = await startBoostAction({ productId, budgetMinor });
      if (!result.ok) {
        toast(t("grow.boost.failed"));
        return;
      }
      toast(t("grow.boost.started"));
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
          {t("titles.grow")}
        </h1>
        <StatusChip tone="line" label={t("grow.boost.optional")} />
      </div>

      <GrowTabs />

      <div className="grid gap-[1.1rem] @[1000px]:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3.5">
          <div>
            <h2 className="font-display text-d2 font-extrabold tracking-tight text-ink">
              {t("grow.boost.headline")}
            </h2>
            <p className="mt-2 max-w-prose text-[0.95rem] text-ink-70">
              {t("grow.boost.lede")}
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
              {t("grow.boost.audienceLabel")}
            </span>
            <input
              className="min-h-11 w-full rounded-xl border border-ink-20 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </label>

          <label className="flex max-w-[320px] flex-col gap-1.5">
            <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
              {t("grow.boost.budgetLabel")}
            </span>
            <span className="flex min-h-11 overflow-hidden rounded-xl border border-ink-20">
              <span className="grid place-items-center bg-paper-2 px-3 text-sm font-bold text-ink-45">
                {shop.currency}
              </span>
              <input
                className="min-w-0 flex-1 bg-white px-3 py-2.5 text-ink outline-none"
                inputMode="numeric"
                value={budgetMinor || ""}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^\d]/g, "");
                  setBudgetMinor(digits ? Number.parseInt(digits, 10) : 0);
                }}
              />
            </span>
            <span className="text-[0.73rem] text-ink-45">
              {t("grow.boost.budgetHint")}
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
              {t("grow.boost.productLabel")}
            </span>
            <select
              className="min-h-11 w-full rounded-xl border border-ink-20 bg-white px-3 py-2.5 text-ink outline-none focus:border-ink"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              disabled={liveProducts.length === 0}
            >
              {liveProducts.length === 0 ? (
                <option value="">{t("grow.boost.noneLive")}</option>
              ) : (
                liveProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {formatMoney(p.price, locale)}
                  </option>
                ))
              )}
            </select>
          </label>

          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <ProductThumb
                key={i}
                palette={i}
                beadCount={12 + i}
                size="lg"
                className="rounded-[11px]"
                gradientId={`boost-fmt-${i}`}
              />
            ))}
          </div>
          <p className="text-[0.73rem] text-ink-45">{t("grow.boost.formatsNote")}</p>
        </div>

        <div className="flex flex-col gap-3.5 @[1000px]:sticky @[1000px]:top-20">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-2.5 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("grow.boost.workedOut")}
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-ink-45">{t("grow.boost.reach")}</span>
                <span className="font-bold text-ink">{t("grow.boost.reachValue")}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-ink-45">{t("grow.boost.where")}</span>
                <span className="font-bold text-ink">{t("grow.boost.whereValue")}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-ink-45">{t("grow.boost.language")}</span>
                <span className="font-bold text-ink">
                  {t("grow.boost.languageValue")}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-t border-hair pt-2">
                <span className="font-bold text-ink">{t("grow.boost.cost")}</span>
                <MoneyDisplay
                  value={{ amountMinor: budgetMinor, currency: shop.currency }}
                  locale={locale}
                  className="font-bold text-ink"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 rounded-tile border border-sea/25 bg-sea/5 px-3.5 py-3 text-sm text-ink-70">
            <Icon name="info" size="md" className="mt-0.5 shrink-0 text-sea-muted" />
            <p>{t("grow.boost.noFbNote")}</p>
          </div>

          <ActionButton
            type="button"
            variant="sun"
            size="lg"
            block
            disabled={pending || liveProducts.length === 0}
            onClick={start}
          >
            {pending ? t("grow.boost.starting") : t("grow.boost.start")}
          </ActionButton>
          <ActionButton asChild variant="line" block>
            <Link href="/dashboard/grow">{t("grow.boost.freeFirst")}</Link>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
