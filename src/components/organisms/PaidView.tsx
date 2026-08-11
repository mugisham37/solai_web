"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { MoneyCount } from "@/components/atoms/MoneyCount";
import { MoneyDisplay } from "@/components/atoms/Money";
import { StatusChip } from "@/components/atoms/StatusChip";
import { orderNet, orderTotal } from "@/lib/dashboard/derive";
import { DASHBOARD_MOTION, MOTION_EASE } from "@/lib/motion";
import type { DashboardOrder, DashboardShop } from "@/types/dashboard";

type PaidViewProps = {
  order: DashboardOrder;
  shop: DashboardShop;
};

export function PaidView({ order, shop }: PaidViewProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const total = orderTotal(order);
  const net = orderNet(order);
  const fees = {
    amountMinor: order.fee.amountMinor + order.disbursement.amountMinor,
    currency: order.fee.currency,
  };
  const seconds = order.settledSeconds ?? 4;

  return (
    <motion.div
      className="mx-auto flex w-full max-w-[560px] flex-col gap-6"
      initial={reduceMotion ? false : { opacity: 0, y: DASHBOARD_MOTION.viewRise.y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DASHBOARD_MOTION.viewRise.duration, ease: MOTION_EASE }}
    >
      <div className="rounded-card border border-sea/30 bg-sea/10 p-5 text-center">
        <span className="mx-auto mb-3 grid size-14 place-items-center rounded-[18px] bg-sea text-white">
          <Icon name="check" size="lg" className="size-7" />
        </span>
        <p className="font-display text-[0.63rem] font-bold tracking-[0.14em] text-sea-muted uppercase">
          {t("paid.eyebrow")}
        </p>
        <p className="mt-1 font-display text-[2rem] font-extrabold tracking-tight text-sea-deep-text">
          <MoneyCount value={net} locale={locale} />
        </p>
        <p className="mt-2 text-sm text-sea-deep-text">
          {shop.walletLabel} · {shop.walletMasked} ·{" "}
          <span className="font-bold">{t("paid.landedIn", { seconds })}</span>
        </p>
      </div>

      <div className="rounded-card border border-hair bg-white p-4">
        <p className="mb-2 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
          {t("paid.ledgerTitle")}
        </p>
        <div className="flex flex-col">
          <LedgerLine
            label={t("paid.buyerPaid")}
            trailing={
              <span className="tabular-nums font-bold">
                + <MoneyDisplay value={total} locale={locale} />
              </span>
            }
          />
          <LedgerLine
            label={t("paid.heldAgainst", { id: order.id })}
            trailing={
              <MoneyDisplay value={total} locale={locale} className="text-berry-muted" />
            }
          />
          <LedgerLine
            label={t("paid.codeAccepted", { code: order.deliveryCode })}
            trailing={<StatusChip tone="live" label={t("paid.verified")} />}
          />
          <LedgerLine
            label={t("paid.feesTaken")}
            trailing={
              <span className="tabular-nums font-bold text-clay">
                − <MoneyDisplay value={fees} locale={locale} className="text-clay" />
              </span>
            }
          />
          <LedgerLine
            label={t("paid.courierPaid")}
            trailing={
              <span className="tabular-nums font-bold text-clay">
                −{" "}
                <MoneyDisplay
                  value={order.delivery}
                  locale={locale}
                  className="text-clay"
                />
              </span>
            }
          />
          <div className="mt-1 flex items-center justify-between gap-4 border-t border-ink-20 pt-2 text-sm font-bold">
            <span>{t("paid.releasedToYou")}</span>
            <MoneyDisplay value={net} locale={locale} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 rounded-tile border border-sea/30 bg-sea/10 px-3.5 py-3 text-sm text-sea-deep-text">
        <Icon name="check" className="mt-0.5 shrink-0" />
        <p>{t("paid.note")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <ActionButton asChild variant="sun">
          <Link href="/dashboard/money">{t("paid.seePayouts")}</Link>
        </ActionButton>
        <ActionButton asChild variant="line">
          <Link href="/dashboard/orders">{t("paid.backToOrders")}</Link>
        </ActionButton>
      </div>
    </motion.div>
  );
}

function LedgerLine({
  label,
  trailing,
}: {
  label: string;
  trailing: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-dashed border-hair py-1.5 text-sm first:border-t-0">
      <span className="text-ink-70">{label}</span>
      {trailing}
    </div>
  );
}
