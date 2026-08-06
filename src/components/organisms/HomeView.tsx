import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/atoms/Icon";
import { KpiCard } from "@/components/atoms/KpiCard";
import { Meter } from "@/components/atoms/Meter";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { Sparkline } from "@/components/atoms/Sparkline";
import { StatusChip } from "@/components/atoms/StatusChip";
import { BalanceCard } from "@/components/molecules/BalanceCard";
import { NudgeCard } from "@/components/molecules/NudgeCard";
import { OrderRow } from "@/components/molecules/OrderRow";
import { findProduct, orderTotal } from "@/lib/dashboard/derive";
import { ORDER_STATUS } from "@/lib/dashboard/status";
import { formatMoney } from "@/lib/money";
import type {
  DashboardProduct,
  HomeSnapshot,
} from "@/types/dashboard";

type HomeViewProps = {
  home: HomeSnapshot;
  products: readonly DashboardProduct[];
};

function greetingKey(date = new Date()): "morning" | "afternoon" | "evening" {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function shopFirstName(shopName: string, holderName: string): string {
  const fromHolder = holderName.split(/\s+/).filter(Boolean).pop();
  if (fromHolder && fromHolder.length > 1) {
    return fromHolder.charAt(0) + fromHolder.slice(1).toLowerCase();
  }
  return shopName.split(/\s+/)[0] ?? shopName;
}

export async function HomeView({ home, products }: HomeViewProps) {
  const t = await getTranslations("dashboard");
  const locale = await getLocale();
  const { shop, kpis, sellerScore } = home;
  const name = shopFirstName(shop.name, shop.holderName);
  const greet = t(`home.greeting.${greetingKey()}`, { name });

  const statusLabels = {
    held: t(ORDER_STATUS.held.labelKey),
    transit: t(ORDER_STATUS.transit.labelKey),
    paid: t(ORDER_STATUS.paid.labelKey),
    problem: t(ORDER_STATUS.problem.labelKey),
  };

  const oos = products.find((p) => p.status === "oos");
  const needsOrder = home.needsYouOrder;
  const needsProduct = needsOrder
    ? findProduct(products, needsOrder.productId, shop.currency)
    : null;

  const deliveredPct =
    (sellerScore.deliveredConfirmed / Math.max(1, sellerScore.deliveredTarget)) *
    100;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
          {shop.name} · {shop.city}
        </p>
        <h1 className="mt-1 font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
          {greet}
        </h1>
      </div>

      <div className="grid gap-[1.1rem] @[1000px]:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <BalanceCard
              tone="deep"
              href="/dashboard/money"
              label={t("home.walletLabel")}
              value={home.availableBalance}
              hint={t("home.walletHint")}
              locale={locale}
            />
            <BalanceCard
              tone="berry"
              href="/dashboard/money"
              label={t("home.heldLabel")}
              value={home.heldBalance}
              hint={t("home.heldHint")}
              locale={locale}
            />
          </div>

          {needsOrder && needsProduct ? (
            <Link
              href={`/dashboard/orders/${needsOrder.id}`}
              className="flex w-full items-center gap-3 rounded-card border border-berry/30 bg-berry/10 p-3 text-left transition-[filter] hover:brightness-[1.02]"
            >
              <ProductThumb
                palette={needsProduct.palette}
                beadCount={14}
                gradientId={`home-needs-${needsOrder.id}`}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.91rem] font-bold text-ink">
                  {t("home.needsYouTitle", { id: needsOrder.id })}
                </span>
                <span className="mt-0.5 block text-[0.73rem] text-ink-45">
                  {t("home.needsYouLede", {
                    buyer: needsOrder.buyerName,
                    amount: formatMoney(orderTotal(needsOrder), locale),
                    when: needsOrder.whenLabel,
                  })}
                </span>
              </span>
              <StatusChip
                status={needsOrder.status}
                label={statusLabels[needsOrder.status]}
              />
              <Icon name="chevronRight" className="shrink-0 text-ink-45" />
            </Link>
          ) : null}

          <div className="grid grid-cols-2 gap-3 @[700px]:grid-cols-4">
            <KpiCard
              label={t("home.kpi.views")}
              value={kpis.viewsWeek}
              delta={`+${kpis.viewsDeltaPct}%`}
              deltaTone="up"
              locale={locale}
            />
            <KpiCard
              label={t("home.kpi.orders")}
              value={kpis.ordersTotal}
              delta={`+${kpis.ordersDelta}`}
              deltaTone="up"
              locale={locale}
            />
            <KpiCard
              label={t("home.kpi.delivered")}
              value={kpis.delivered}
              delta={t("home.kpi.ofTotal", { total: kpis.ordersTotal })}
              locale={locale}
            />
            <KpiCard
              label={t("home.kpi.problems")}
              value={kpis.problems}
              delta={
                kpis.problems > 0 ? t("home.kpi.open") : t("home.kpi.none")
              }
              deltaTone={kpis.problems > 0 ? "down" : "neutral"}
              locale={locale}
            />
          </div>

          <div className="rounded-card border border-hair bg-white p-3">
            <div className="mb-1 flex items-center justify-between gap-2 px-1">
              <p className="font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
                {t("home.activity")}
              </p>
              <Link
                href="/dashboard/orders"
                className="text-[0.82rem] font-semibold text-ink-45 hover:text-ink"
              >
                {t("home.allOrders")}
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-hair">
              {home.recentOrders.map((order) => {
                const product = findProduct(
                  products,
                  order.productId,
                  shop.currency,
                );
                return (
                  <OrderRow
                    key={order.id}
                    order={order}
                    product={product}
                    statusLabel={statusLabels[order.status]}
                    locale={locale}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 @[1000px]:sticky @[1000px]:top-20">
          <div className="rounded-card border border-hair bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[0.91rem] font-bold">{t("home.scoreTitle")}</p>
              <StatusChip tone="live" label={t("home.scoreBuilding")} />
            </div>
            <div className="flex flex-col gap-3.5">
              <div>
                <div className="mb-1 flex justify-between text-[0.73rem] text-ink-45">
                  <span>{t("home.scoreDelivered")}</span>
                  <span className="font-bold text-ink">
                    {t("home.scoreDeliveredCount", {
                      confirmed: sellerScore.deliveredConfirmed,
                      target: sellerScore.deliveredTarget,
                    })}
                  </span>
                </div>
                <Meter
                  value={deliveredPct}
                  label={t("home.scoreDelivered")}
                />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[0.73rem] text-ink-45">
                  <span>{t("home.scoreHold")}</span>
                  <span className="font-bold text-ink">
                    {t("home.scoreHoldMore", {
                      count: sellerScore.ordersUntilShorterHold,
                    })}
                  </span>
                </div>
                <Meter
                  value={sellerScore.holdProgressPct}
                  label={t("home.scoreHold")}
                  tone="berry"
                />
              </div>
            </div>
            <p className="mt-3 text-[0.73rem] text-ink-45">{t("home.scoreNote")}</p>
          </div>

          <div className="rounded-card border border-hair bg-white p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
                {t("home.viewsWeek")}
              </p>
              <StatusChip tone="grey" label={String(kpis.viewsWeek)} />
            </div>
            <Sparkline
              values={home.sparkline}
              highlightIndex={home.sparklineHighlightIndex}
              label={t("home.viewsWeek")}
            />
            <p className="mt-2 text-[0.73rem] text-ink-45">{t("home.viewsNote")}</p>
          </div>

          <div className="rounded-card bg-paper-2 p-4">
            <p className="mb-2.5 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("home.nudgesTitle")}
            </p>
            <div className="flex flex-col gap-2">
              {oos ? (
                <NudgeCard
                  href={`/dashboard/products/${oos.id}`}
                  icon="box"
                  title={t("home.nudge.oosTitle", { name: oos.name })}
                  subtitle={t("home.nudge.oosSub")}
                />
              ) : null}
              <NudgeCard
                href="/dashboard/grow"
                icon="whatsapp"
                title={t("home.nudge.catalogueTitle")}
                subtitle={t("home.nudge.catalogueSub")}
              />
              <NudgeCard
                href="/start"
                icon="spark"
                title={t("home.nudge.addTitle")}
                subtitle={t("home.nudge.addSub")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
