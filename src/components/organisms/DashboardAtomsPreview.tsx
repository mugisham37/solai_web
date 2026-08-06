"use client";

import { useLocale, useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { CountBadge } from "@/components/atoms/CountBadge";
import { EmptyState } from "@/components/atoms/EmptyState";
import { KpiCard } from "@/components/atoms/KpiCard";
import { Meter } from "@/components/atoms/Meter";
import { MoneyCount } from "@/components/atoms/MoneyCount";
import { MoneyDisplay } from "@/components/atoms/Money";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Sparkline } from "@/components/atoms/Sparkline";
import { StatusChip } from "@/components/atoms/StatusChip";
import { ORDER_STATUS } from "@/lib/dashboard/status";
import type { HomeSnapshot, OrderStatus } from "@/types/dashboard";

const SAMPLE_STATUSES: OrderStatus[] = ["held", "transit", "paid", "problem"];

type DashboardAtomsPreviewProps = {
  home: HomeSnapshot;
  needsYou: number;
};

/** Temporary Phase 2/3 surface — atoms + live derived totals from the store. */
export function DashboardAtomsPreview({ home, needsYou }: DashboardAtomsPreviewProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-card border border-hair bg-white p-5">
        <p className="text-xs font-bold tracking-wide text-ink-45 uppercase">
          {t("atomsPreview.eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-d2 font-extrabold text-ink uppercase">
          {t("atomsPreview.title")}
        </h2>
        <p className="mt-2 max-w-prose text-sm text-ink-70">{t("atomsPreview.lede")}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {SAMPLE_STATUSES.map((status) => (
            <StatusChip
              key={status}
              status={status}
              label={t(ORDER_STATUS[status].labelKey)}
            />
          ))}
          <CountBadge count={needsYou} className="ml-0" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 @[700px]:grid-cols-4">
          <KpiCard
            label={t("atomsPreview.kpiViews")}
            value={home.kpis.viewsWeek}
            delta={`+${home.kpis.viewsDeltaPct}%`}
            deltaTone="up"
            locale={locale}
          />
          <KpiCard
            label={t("atomsPreview.kpiOrders")}
            value={home.kpis.ordersTotal}
            delta={`+${home.kpis.ordersDelta}`}
            deltaTone="up"
            locale={locale}
          />
          <KpiCard
            label={t("atomsPreview.kpiDelivered")}
            value={home.kpis.delivered}
            delta={`of ${home.kpis.ordersTotal}`}
            locale={locale}
          />
          <KpiCard
            label={t("atomsPreview.kpiProblems")}
            value={home.kpis.problems}
            delta={
              home.kpis.problems > 0 ? t("atomsPreview.kpiOpen") : t("atomsPreview.kpiNone")
            }
            deltaTone={home.kpis.problems > 0 ? "down" : "neutral"}
            locale={locale}
          />
        </div>

        <div className="mt-4 grid gap-3 @[700px]:grid-cols-2">
          <div className="rounded-card border border-hair bg-deep p-4 text-on-deep">
            <p className="text-xs text-on-deep-30">{t("atomsPreview.wallet")}</p>
            <p className="mt-1 font-display text-[1.8rem] font-extrabold">
              <MoneyCount value={home.availableBalance} locale={locale} />
            </p>
            <p className="mt-3 text-xs text-on-deep-30">{t("atomsPreview.held")}</p>
            <p className="mt-1 font-display text-xl font-extrabold text-berry">
              <MoneyDisplay value={home.heldBalance} locale={locale} className="text-berry" />
            </p>
          </div>
          <div className="rounded-card border border-hair bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold">{t("atomsPreview.score")}</p>
              <StatusChip tone="live" label={t("atomsPreview.building")} />
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs text-ink-45">
                  <span>{t("atomsPreview.delivered")}</span>
                  <span className="font-bold text-ink">
                    {home.sellerScore.deliveredConfirmed} of {home.sellerScore.deliveredTarget}
                  </span>
                </div>
                <Meter
                  value={
                    (home.sellerScore.deliveredConfirmed /
                      Math.max(1, home.sellerScore.deliveredTarget)) *
                    100
                  }
                  label={t("atomsPreview.delivered")}
                />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-ink-45">
                  <span>{t("atomsPreview.holdShortens")}</span>
                  <span className="font-bold text-ink">
                    {home.sellerScore.ordersUntilShorterHold} more
                  </span>
                </div>
                <Meter
                  value={home.sellerScore.holdProgressPct}
                  label={t("atomsPreview.holdShortens")}
                  tone="berry"
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-45">{t("atomsPreview.viewsWeek")}</p>
            <Sparkline
              values={home.sparkline}
              highlightIndex={home.sparklineHighlightIndex}
              label={t("atomsPreview.viewsWeek")}
              className="mt-2"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 @[700px]:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold text-ink-45 uppercase">
              {t("atomsPreview.skeleton")}
            </p>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-16" />
            </div>
          </div>
          <EmptyState
            icon="tag"
            tone="good"
            title={t("empty.needsYou.title")}
            description={t("empty.needsYou.description")}
            action={
              <ActionButton type="button" variant="line" size="sm">
                {t("empty.needsYou.action")}
              </ActionButton>
            }
          />
        </div>
      </section>
    </div>
  );
}
