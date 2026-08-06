import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { MoneyDisplay } from "@/components/atoms/Money";
import { StatusChip } from "@/components/atoms/StatusChip";
import { BalanceCard } from "@/components/molecules/BalanceCard";
import { ChangeWalletButton } from "@/components/molecules/ChangeWalletButton";
import { PayoutRow } from "@/components/molecules/PayoutRow";
import { StatementExportButton } from "@/components/molecules/StatementExportButton";
import type { MoneySnapshot } from "@/types/dashboard";

type MoneyViewProps = {
  money: MoneySnapshot;
};

const PAYOUT_CHARGE_MINOR = 400;

export async function MoneyView({ money }: MoneyViewProps) {
  const t = await getTranslations("dashboard");
  const locale = await getLocale();
  const { shop, availableBalance, heldBalance, lifetimePaid, monthSales, payouts } =
    money;

  const feeMinor = Math.round(monthSales.amountMinor * 0.03);
  const yoursMinor = Math.max(
    0,
    monthSales.amountMinor - feeMinor - PAYOUT_CHARGE_MINOR,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
          {t("titles.money")}
        </h1>
        <StatementExportButton payouts={payouts} locale={locale} />
      </div>

      <div className="grid gap-[1.1rem] @[1000px]:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 gap-3 @[560px]:grid-cols-3">
            <BalanceCard
              tone="deep"
              label={t("money.wallet")}
              value={availableBalance}
              locale={locale}
            />
            <BalanceCard
              tone="berry"
              label={t("money.held")}
              value={heldBalance}
              locale={locale}
            />
            <BalanceCard
              tone="sea"
              label={t("money.lifetime")}
              value={lifetimePaid}
              locale={locale}
            />
          </div>

          <div className="rounded-card border border-hair bg-white p-3">
            <p className="mb-1 px-1 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("money.payouts")}
            </p>
            {payouts.length > 0 ? (
              <div className="flex flex-col divide-y divide-hair">
                {payouts.map((payout) => (
                  <PayoutRow
                    key={payout.id}
                    payout={payout}
                    locale={locale}
                    meta={t("money.payoutMeta", {
                      id: payout.id,
                      order: payout.orderId,
                      when: payout.whenLabel,
                    })}
                    settledLabel={t("money.settledIn", {
                      seconds: payout.settledSeconds,
                    })}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="wallet"
                title={t("money.emptyTitle")}
                description={t("money.emptyLede")}
                className="border-0"
              />
            )}
          </div>

          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-2.5 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("money.flowTitle")}
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-45">{t("money.salesMonth")}</span>
                <MoneyDisplay
                  value={monthSales}
                  locale={locale}
                  className="font-bold text-ink"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-45">{t("money.fee")}</span>
                <span className="font-bold tabular-nums text-clay">
                  −{" "}
                  {new Intl.NumberFormat(locale).format(feeMinor)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-45">{t("money.payoutCharges")}</span>
                <span className="font-bold tabular-nums text-clay">
                  −{" "}
                  {new Intl.NumberFormat(locale).format(PAYOUT_CHARGE_MINOR)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-hair pt-2">
                <span className="font-bold text-ink">{t("money.yours")}</span>
                <MoneyDisplay
                  value={{ amountMinor: yoursMinor, currency: shop.currency }}
                  locale={locale}
                  className="font-bold text-ink"
                />
              </div>
            </div>
            <ActionButton asChild variant="plain" className="mt-2 px-0">
              <Link href="/dashboard/money/plans">{t("money.plansCta")}</Link>
            </ActionButton>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 @[1000px]:sticky @[1000px]:top-20">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.63rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              {t("money.paidInto")}
            </p>
            <div className="flex items-center gap-2.5">
              <IconTile variant="sun">
                <Icon name="wallet" />
              </IconTile>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.91rem] font-bold text-ink">
                  {shop.walletLabel}
                </span>
                <span className="block text-[0.73rem] text-ink-45">
                  {shop.walletMasked} · {shop.holderName}
                </span>
              </span>
              <StatusChip tone="live" label={t("money.verified")} />
            </div>
            <div className="mt-3">
              <ChangeWalletButton
                draftId={shop.draftId}
                walletMasked={shop.walletMasked}
                label={t("money.changeWallet")}
                block
              />
            </div>
          </div>

          <div className="rounded-card bg-paper-2 p-4">
            <p className="text-[0.91rem] font-bold text-ink">{t("money.reserveTitle")}</p>
            <div className="mt-2.5 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-45">{t("money.heldBack")}</span>
                <MoneyDisplay
                  value={{ amountMinor: 0, currency: shop.currency }}
                  locale={locale}
                  className="font-bold text-ink"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-45">{t("money.appliesFor")}</span>
                <span className="font-bold text-ink">{t("money.firstOrders")}</span>
              </div>
            </div>
            <p className="mt-2.5 text-[0.73rem] text-ink-45">{t("money.reserveNote")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
