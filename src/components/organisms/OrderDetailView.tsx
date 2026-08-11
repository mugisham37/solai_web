"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { MoneyDisplay } from "@/components/atoms/Money";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { StatusChip } from "@/components/atoms/StatusChip";
import { LedgerTable } from "@/components/molecules/LedgerTable";
import { MoneyFlow } from "@/components/molecules/MoneyFlow";
import { ReportProblemSheet } from "@/components/molecules/ReportProblemSheet";
import { orderNet, orderTotal } from "@/lib/dashboard/derive";
import { escrowStageForOrder } from "@/lib/dashboard/escrow";
import { ORDER_STATUS } from "@/lib/dashboard/status";
import { cn } from "@/lib/cn";
import type { DashboardOrder, DashboardProduct } from "@/types/dashboard";

type OrderDetailViewProps = {
  order: DashboardOrder;
  product: DashboardProduct;
};

const BUYER_WA = "https://wa.me/250788000902";

export function OrderDetailView({ order, product }: OrderDetailViewProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [reportOpen, setReportOpen] = useState(false);

  const statusMeta = ORDER_STATUS[order.status];
  const statusLabel = t(statusMeta.labelKey);
  const statusNote = t(statusMeta.noteKey);
  const total = orderTotal(order);
  const net = orderNet(order);
  const stage = escrowStageForOrder(order.status);
  const firstName = order.buyerName.split(" ")[0] ?? order.buyerName;
  const isPaid = order.status === "paid";
  const isProblem = order.status === "problem";

  const courierChip =
    order.status === "held"
      ? t("orders.detail.courierWaiting")
      : order.status === "transit"
        ? t("orders.detail.courierTransit")
        : t("orders.detail.courierDelivered");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
            {t("orders.detail.title", { id: order.id })}
          </h1>
          <p className="mt-1 text-[0.73rem] text-ink-45">
            {order.whenLabel} · {order.buyerName}
          </p>
        </div>
        <StatusChip status={order.status} label={statusLabel} />
      </div>

      <MoneyFlow variant="four" current={stage} />

      <div className="grid gap-[1.1rem] @[1000px]:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3.5">
          {isProblem ? (
            <div className="rounded-card border border-clay/25 bg-clay/5 p-4">
              <p className="text-[0.91rem] font-bold text-clay">
                {t("orders.detail.disputeTitle")}
              </p>
              <p className="mt-1 text-[0.73rem] text-clay">
                {t("orders.detail.disputeLede")}
              </p>
              <ActionButton type="button" variant="line" size="sm" className="mt-3">
                {t("orders.detail.disputeCta")}
              </ActionButton>
            </div>
          ) : (
            <div
              className={cn(
                "rounded-card p-4",
                isPaid
                  ? "border border-sea/30 bg-sea/10"
                  : "border border-berry/30 bg-berry/10",
              )}
            >
              <p
                className={cn(
                  "text-[0.73rem]",
                  isPaid ? "text-sea-deep-text" : "text-berry-muted",
                )}
              >
                {isPaid
                  ? t("orders.detail.paidToWallet")
                  : t("orders.detail.heldSafely")}
              </p>
              <p
                className={cn(
                  "mt-1 font-display text-[1.8rem] font-extrabold tracking-tight",
                  isPaid ? "text-sea-deep-text" : "text-berry-muted",
                )}
              >
                <MoneyDisplay
                  value={isPaid ? net : total}
                  locale={locale}
                  className={isPaid ? "text-sea-deep-text" : "text-berry-muted"}
                />
              </p>
              <p
                className={cn(
                  "mt-1 text-sm",
                  isPaid ? "text-sea-deep-text" : "text-berry-muted",
                )}
              >
                {statusNote}
              </p>
            </div>
          )}

          <div className="rounded-card border border-hair bg-white px-2 py-1">
            <div className="flex items-center gap-3 px-1 py-3">
              <ProductThumb
                palette={product.palette}
                gradientId={`order-detail-${order.id}`}
                beadCount={13}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.91rem] font-bold">
                  {product.name}
                </span>
                <span className="text-[0.73rem] text-ink-45">
                  ×{order.qty} ·{" "}
                  <MoneyDisplay value={product.price} locale={locale} className="font-semibold text-ink-45" />{" "}
                  {t("orders.detail.each")}
                </span>
              </span>
              {product.id ? (
                <ActionButton asChild variant="line" size="sm">
                  <Link
                    href={`/dashboard/products/${product.id}`}
                    aria-label={t("orders.detail.editProduct")}
                  >
                    <Icon name="edit" size="sm" />
                  </Link>
                </ActionButton>
              ) : null}
            </div>

            <div className="flex items-center gap-3 border-t border-hair px-1 py-3">
              <IconTile variant="neutral">
                <Icon name="users" />
              </IconTile>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.91rem] font-bold">{order.buyerName}</span>
                <span className="text-[0.73rem] text-ink-45">
                  {order.buyerArea} · +250 78• ••• 902
                </span>
              </span>
              <ActionButton asChild variant="line" size="sm">
                <a
                  href={BUYER_WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("orders.detail.messageBuyer")}
                >
                  <Icon name="whatsapp" size="sm" />
                </a>
              </ActionButton>
            </div>

            <div className="flex items-center gap-3 border-t border-hair px-1 py-3">
              <IconTile variant="neutral">
                <Icon name="truck" />
              </IconTile>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.91rem] font-bold">
                  {order.courierLabel}
                </span>
                <span className="text-[0.73rem] text-ink-45">
                  {t("orders.detail.tracked")}
                </span>
              </span>
              <StatusChip tone="line" label={courierChip} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 @[1000px]:sticky @[1000px]:top-20">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-2 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {isPaid
                ? t("orders.detail.ledgerReceived")
                : t("orders.detail.ledgerWillReceive")}
            </p>
            <LedgerTable
              locale={locale}
              total={net}
              totalLabel={
                isPaid
                  ? t("orders.detail.landed")
                  : t("orders.detail.lands")
              }
              lines={[
                {
                  label: `${product.name} ×${order.qty}`,
                  amount: order.item,
                },
                {
                  label: t("orders.detail.delivery"),
                  amount: order.delivery,
                },
                {
                  label: t("orders.detail.fee"),
                  amount: order.fee,
                  tone: "negative",
                },
                {
                  label: t("orders.detail.disbursement"),
                  amount: order.disbursement,
                  tone: "negative",
                },
              ]}
            />
          </div>

          {order.status === "held" ? (
            <>
              <div className="flex gap-2 rounded-tile border border-hair bg-paper-2 px-3.5 py-3 text-sm text-ink-70">
                <Icon name="clock" className="mt-0.5 shrink-0 text-ink-45" />
                <p>
                  {t.rich("orders.detail.autoRelease", {
                    name: firstName,
                    strong: (chunks) => (
                      <span className="font-bold text-ink">{chunks}</span>
                    ),
                  })}
                </p>
              </div>
              <ActionButton asChild variant="sun" size="lg" block>
                <Link href={`/dashboard/orders/${order.id}/deliver`}>
                  {t("orders.detail.handOver")}
                  <Icon name="arrowRight" />
                </Link>
              </ActionButton>
              <ActionButton
                type="button"
                variant="line"
                block
                onClick={() => setReportOpen(true)}
              >
                {t("orders.detail.report")}
              </ActionButton>
            </>
          ) : null}

          {order.status === "transit" ? (
            <>
              <div className="flex gap-2 rounded-tile border border-sea/30 bg-sea/10 px-3.5 py-3 text-sm text-sea-deep-text">
                <Icon name="truck" className="mt-0.5 shrink-0" />
                <p>{t("orders.detail.transitNote", { name: firstName })}</p>
              </div>
              <ActionButton asChild variant="sun" size="lg" block>
                <Link href={`/dashboard/orders/${order.id}/deliver`}>
                  {t("orders.detail.enterCode")}
                  <Icon name="arrowRight" />
                </Link>
              </ActionButton>
            </>
          ) : null}

          {order.status === "paid" ? (
            <>
              <div className="flex gap-2 rounded-tile border border-sea/30 bg-sea/10 px-3.5 py-3 text-sm text-sea-deep-text">
                <Icon name="check" className="mt-0.5 shrink-0" />
                <p>
                  {t("orders.detail.settledNote", {
                    seconds: order.settledSeconds ?? 4,
                  })}
                </p>
              </div>
              <ActionButton asChild variant="line" block>
                <Link href={`/dashboard/orders/${order.id}/paid`}>
                  {t("orders.detail.seePayout")}
                </Link>
              </ActionButton>
            </>
          ) : null}

          {order.status === "problem" ? (
            <ActionButton type="button" variant="line" block>
              {t("orders.detail.messageSupport")}
            </ActionButton>
          ) : null}
        </div>
      </div>

      <ReportProblemSheet
        orderId={order.id}
        open={reportOpen}
        onOpenChange={setReportOpen}
      />
    </div>
  );
}
