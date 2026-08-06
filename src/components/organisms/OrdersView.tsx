import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Icon } from "@/components/atoms/Icon";
import { MoneyDisplay } from "@/components/atoms/Money";
import { OrderFilters } from "@/components/molecules/OrderFilters";
import { OrderRow } from "@/components/molecules/OrderRow";
import { OrdersExportButton } from "@/components/molecules/OrdersExportButton";
import { findProduct } from "@/lib/dashboard/derive";
import { ORDER_STATUS } from "@/lib/dashboard/status";
import type {
  DashboardProduct,
  DashboardShop,
  OrderFilter,
  OrderListResult,
} from "@/types/dashboard";
import type { Money } from "@/types/money";

type OrdersViewProps = {
  shop: DashboardShop;
  result: OrderListResult;
  products: readonly DashboardProduct[];
  filter: OrderFilter;
  heldBalance: Money;
  query?: string;
};

export async function OrdersView({
  shop,
  result,
  products,
  filter,
  heldBalance,
  query,
}: OrdersViewProps) {
  const t = await getTranslations("dashboard");
  const locale = await getLocale();

  const productsById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<
    string,
    DashboardProduct
  >;

  const statusLabels = {
    held: t(ORDER_STATUS.held.labelKey),
    transit: t(ORDER_STATUS.transit.labelKey),
    paid: t(ORDER_STATUS.paid.labelKey),
    problem: t(ORDER_STATUS.problem.labelKey),
  };

  const emptyIsGoodNews = filter === "held" && result.total === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
            {t("titles.orders")}
          </h1>
          <p className="mt-1 text-[0.73rem] text-ink-45">
            {t("orders.subtitle", { count: result.counts.all })}
            {" · "}
            <MoneyDisplay
              value={heldBalance}
              locale={locale}
              className="font-semibold text-ink-45"
            />{" "}
            {t("orders.heldNow")}
          </p>
        </div>
        <OrdersExportButton
          orders={result.rows}
          productsById={productsById}
          statusLabels={statusLabels}
          locale={locale}
        />
      </div>

      <OrderFilters active={filter} counts={result.counts} query={query} />

      {result.rows.length > 0 ? (
        <div className="rounded-card border border-hair bg-white px-2 py-1">
          <div className="flex flex-col divide-y divide-hair">
            {result.rows.map((order) => {
              const product = findProduct(products, order.productId, shop.currency);
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
      ) : (
        <EmptyState
          icon="tag"
          tone={emptyIsGoodNews ? "good" : "neutral"}
          title={t(emptyIsGoodNews ? "empty.needsYou.title" : "orders.emptyTitle")}
          description={
            emptyIsGoodNews
              ? t("empty.needsYou.description")
              : t("orders.emptyFiltered")
          }
          action={
            filter !== "all" ? (
              <ActionButton asChild variant="line" size="sm">
                <Link href="/dashboard/orders">{t("empty.needsYou.action")}</Link>
              </ActionButton>
            ) : undefined
          }
        />
      )}

      <div className="flex gap-2 rounded-tile border border-hair bg-paper-2 px-3.5 py-3 text-sm text-ink-70">
        <Icon name="info" size="md" className="mt-0.5 shrink-0 text-ink-45" />
        <p>{t("orders.escrowNote")}</p>
      </div>
    </div>
  );
}
