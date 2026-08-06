import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/atoms/Icon";
import { MoneyDisplay } from "@/components/atoms/Money";
import { PlanCard } from "@/components/molecules/PlanCard";
import { formatMoney } from "@/lib/money";
import type { MoneySnapshot, ShopPlan } from "@/types/dashboard";

type PlansViewProps = {
  money: MoneySnapshot;
  paidCount: number;
};

const PLUS_MONTHLY_MINOR = 4900;
/** 3% vs 1.5% + 4,900 → break-even (~RWF 327,000) matching the HTML prototype. */
const BREAK_EVEN_MINOR = 327_000;

export async function PlansView({ money, paidCount }: PlansViewProps) {
  const t = await getTranslations("dashboard");
  const locale = await getLocale();
  const sales = money.monthSales.amountMinor;
  const freeCost = Math.round(sales * 0.03);
  const plusCost = Math.round(sales * 0.015) + PLUS_MONTHLY_MINOR;
  const plusCostsMore = plusCost > freeCost;
  const plan: ShopPlan = money.plan;

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4">
      <div>
        <p className="font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
          {t("plans.eyebrow")}
        </p>
        <h1 className="mt-1.5 font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
          {t("plans.title", { count: paidCount })}
        </h1>
        <p className="mt-2 max-w-prose text-[0.95rem] text-ink-70">{t("plans.lede")}</p>
      </div>

      <div className="grid gap-3 @[700px]:grid-cols-2">
        <PlanCard
          plan="free"
          current={plan}
          name={t("plans.free.name")}
          price={t("plans.perMonth", {
            price: formatMoney(
              { amountMinor: 0, currency: money.shop.currency },
              locale,
            ),
          })}
          features={t("plans.free.features")}
        />
        <PlanCard
          plan="plus"
          current={plan}
          name={t("plans.plus.name")}
          price={t("plans.perMonth", {
            price: formatMoney(
              { amountMinor: PLUS_MONTHLY_MINOR, currency: money.shop.currency },
              locale,
            ),
          })}
          features={t("plans.plus.features")}
        />
      </div>

      <div className="rounded-card bg-paper-2 p-4">
        <p className="text-[0.91rem] font-bold text-ink">
          {plusCostsMore ? t("plans.compareMore") : t("plans.compareLess")}
        </p>
        <div className="mt-2.5 flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-ink-45">
              {t("plans.onFree", {
                sales: formatMoney(money.monthSales, locale),
              })}
            </span>
            <span className="font-bold tabular-nums text-ink">
              {new Intl.NumberFormat(locale).format(freeCost)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-ink-45">
              {t("plans.onPlus", {
                fee: new Intl.NumberFormat(locale).format(PLUS_MONTHLY_MINOR),
              })}
            </span>
            <span className="font-bold tabular-nums text-ink">
              {new Intl.NumberFormat(locale).format(plusCost)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-hair pt-2">
            <span className="font-bold text-ink">{t("plans.breakEven")}</span>
            <span className="font-bold text-ink">
              <MoneyDisplay
                value={{
                  amountMinor: BREAK_EVEN_MINOR,
                  currency: money.shop.currency,
                }}
                locale={locale}
              />{" "}
              {t("plans.perMonthSuffix")}
            </span>
          </div>
        </div>
        <p className="mt-2.5 text-[0.73rem] text-ink-45">
          {plusCostsMore ? t("plans.adviceStay") : t("plans.adviceSwitch")}
        </p>
      </div>

      <div className="flex gap-2 rounded-tile border border-hair bg-paper-2 px-3.5 py-3 text-sm text-ink-70">
        <Icon name="info" size="md" className="mt-0.5 shrink-0 text-ink-45" />
        <p>{t("plans.note")}</p>
      </div>
    </div>
  );
}
