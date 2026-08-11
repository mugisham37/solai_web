import { Link } from "@/i18n/navigation";
import { KpiTile } from "@/components/atoms/KpiTile";
import { Lockbar } from "@/components/atoms/Lockbar";
import { MoneyDisplay } from "@/components/atoms/Money";
import { SlaChip } from "@/components/atoms/SlaChip";
import { StatusChip } from "@/components/atoms/StatusChip";
import { Icon } from "@/components/atoms/Icon";
import { ActionButton } from "@/components/atoms/ActionButton";
import type { ConsoleOverviewSnapshot } from "@/types/console";

type OverviewViewProps = {
  snapshot: ConsoleOverviewSnapshot;
  locale: string;
};

export function OverviewView({ snapshot, locale }: OverviewViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <Lockbar>
        <span>
          <span className="font-bold text-on-deep">
            Nobody in this console can move money to themselves.
          </span>{" "}
          You choose an outcome for a case; the ledger executes it against the
          escrow account. There is no “send funds” field anywhere in this
          product, and every action is signed and logged.
        </span>
      </Lockbar>

      <div className="grid grid-cols-2 gap-2.5 @[700px]:grid-cols-4">
        <KpiTile
          label="Held in escrow now"
          value={<MoneyDisplay value={snapshot.heldInEscrow} locale={locale} />}
          detail={`across ${snapshot.heldOrderCount} orders`}
          tone="held"
        />
        <KpiTile
          label="Released today"
          value={
            <MoneyDisplay value={snapshot.releasedToday} locale={locale} />
          }
          detail={`${snapshot.releasedTodayCount} payouts`}
          tone="good"
        />
        <KpiTile
          label="Open disputes"
          value={snapshot.openDisputes}
          detail={
            <>
              <MoneyDisplay value={snapshot.frozenTotal} locale={locale} />{" "}
              frozen
            </>
          }
          tone="alarm"
        />
        <KpiTile
          label="Breaching the 48h promise"
          value={snapshot.breachingCount}
          detail="answer these first"
          tone={snapshot.breachingCount > 0 ? "alarm" : "default"}
        />
      </div>

      <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Needs a human, soonest first
            </p>
            <Link
              href="/console/disputes"
              className="text-[0.83rem] font-semibold text-ink-45 hover:text-ink"
            >
              Open the full queue →
            </Link>
          </div>

          <div className="overflow-hidden rounded-card border border-hair bg-white">
            <div className="hidden grid-cols-[1.2fr_1.4fr_1fr_0.9fr_28px] gap-3 border-b border-hair px-3.5 py-2 text-[0.68rem] font-bold tracking-wide text-ink-45 uppercase @[860px]:grid">
              <span>Case</span>
              <span>Reason</span>
              <span>Amount</span>
              <span>Time left</span>
              <span />
            </div>
            {snapshot.urgentCases.map((d) => (
              <Link
                key={d.id}
                href={`/console/disputes/${d.id}`}
                className="grid grid-cols-1 gap-1 border-b border-hair px-3.5 py-3 last:border-b-0 hover:bg-paper-2 @[860px]:grid-cols-[1.2fr_1.4fr_1fr_0.9fr_28px] @[860px]:items-center @[860px]:gap-3"
              >
                <span className="text-sm font-bold">
                  #{d.id} · order {d.orderId}
                </span>
                <span className="text-sm text-ink-70">{d.reasonLabel}</span>
                <span className="text-sm">
                  <MoneyDisplay value={d.amount} locale={locale} />
                </span>
                <SlaChip hours={d.slaHours} />
                <span className="hidden justify-end text-ink-45 @[860px]:flex">
                  <Icon name="chevronRight" size="sm" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Raised automatically
            </p>
            <StatusChip label="Last hour" tone="line" />
          </div>

          <div className="grid gap-2.5 @[700px]:grid-cols-2">
            {snapshot.autoSignals.map((sig) => (
              <div
                key={sig.id}
                className={
                  sig.kind === "geo"
                    ? "rounded-card border border-clay/30 bg-clay/[0.07] p-4"
                    : "rounded-card border border-hair bg-white p-4"
                }
              >
                <p
                  className={
                    sig.kind === "geo"
                      ? "m-0 text-[0.92rem] font-bold text-clay"
                      : "m-0 text-[0.92rem] font-bold text-ink"
                  }
                >
                  {sig.title}
                </p>
                <p
                  className={
                    sig.kind === "geo"
                      ? "mt-1 text-[0.74rem] text-clay/80"
                      : "mt-1 text-[0.74rem] text-ink-45"
                  }
                >
                  {sig.detail}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionButton variant="line" size="sm" asChild>
                    <Link href={`/console/people/${sig.personId}`}>
                      {sig.kind === "geo" ? "Open the file" : "Review"}
                    </Link>
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 @[1000px]:sticky @[1000px]:top-[4.6rem]">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Rails and channels
            </p>
            <div className="flex flex-col">
              {snapshot.rails.map((rail) => (
                <div
                  key={rail.id}
                  className="flex items-center justify-between gap-3 border-b border-dashed border-hair py-2 text-sm last:border-b-0"
                >
                  <span>{rail.name}</span>
                  <StatusChip
                    label={rail.status === "up" ? "Up" : "Degraded"}
                    tone={rail.status === "up" ? "live" : "clay"}
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.74rem] text-ink-45">
              Airtel disbursements are queueing. {snapshot.failedPayouts}{" "}
              payouts waiting, retrying every 5 minutes. Sellers have been told.
            </p>
            <ActionButton
              variant="line"
              size="sm"
              block
              className="mt-3"
              asChild
            >
              <Link href="/console/ledger">Open the retry queue</Link>
            </ActionButton>
          </div>

          <div className="rounded-card border border-sea/30 bg-sea/10 p-4">
            <p className="m-0 text-[0.92rem] font-bold text-sea-muted">
              Reconciliation · {snapshot.lastReconciliationLabel.split(" · ")[0]}
            </p>
            <p className="mt-1 text-[0.74rem] text-sea-muted/80">
              Ledger balance and the real merchant account matched to the franc.
              Next run {snapshot.nextReconciliationLabel}.
            </p>
          </div>

          <div className="rounded-card bg-paper-2 p-4">
            <p className="m-0 mb-1.5 text-[0.92rem] font-bold text-ink">
              Why rail health is on this screen
            </p>
            <p className="m-0 text-[0.74rem] text-ink-45">
              A degraded disbursement API looks exactly like fraud from a
              seller’s side. An agent needs to know which one they are looking
              at before they answer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
