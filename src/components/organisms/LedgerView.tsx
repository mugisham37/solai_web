"use client";

import { useTransition } from "react";
import {
  retryAllDisbursementsAction,
  runReconciliationAction,
} from "@/app/actions/console/ledger";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { KpiTile } from "@/components/atoms/KpiTile";
import { Lockbar } from "@/components/atoms/Lockbar";
import { MoneyDisplay } from "@/components/atoms/Money";
import { AuditEntryRow } from "@/components/molecules/AuditEntry";
import { PermissionMatrix } from "@/components/molecules/PermissionMatrix";
import {
  RetryQueueRow,
  RetryTableHead,
} from "@/components/molecules/RetryQueueRow";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useRouter } from "@/i18n/navigation";
import type { LedgerSnapshot } from "@/types/console";

type LedgerViewProps = {
  data: LedgerSnapshot;
  locale: string;
  permissionLabels: Record<string, string>;
};

export function LedgerView({
  data,
  locale,
  permissionLabels,
}: LedgerViewProps) {
  const { toast } = useToastContext();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const diffZero = data.difference.amountMinor === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
            Ledger &amp; audit
          </h1>
          <p className="mt-1 text-[0.74rem] text-ink-45">
            Escrow account · MTN merchant · reconciled twice a day
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 @[700px]:grid-cols-4">
        <KpiTile
          label="Ledger balance"
          value={
            <MoneyDisplay value={data.ledgerBalance} locale={locale} />
          }
        />
        <KpiTile
          label="Merchant statement"
          value={
            <MoneyDisplay value={data.merchantStatement} locale={locale} />
          }
        />
        <KpiTile
          label="Difference"
          value={data.difference.amountMinor}
          detail="this number is the alarm"
          tone={diffZero ? "good" : "alarm"}
        />
        <KpiTile
          label="Failed disbursements"
          value={data.failedPayouts}
          tone={data.failedPayouts ? "alarm" : "good"}
        />
      </div>

      <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Disbursement retry queue · Airtel degraded
            </p>
            <ActionButton
              type="button"
              variant="line"
              size="sm"
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  const result = await retryAllDisbursementsAction();
                  toast(result.ok ? "All retries sent" : "Could not retry");
                  if (result.ok) router.refresh();
                });
              }}
            >
              <Icon name="refresh" size="sm" />
              Retry all
            </ActionButton>
          </div>

          <div className="overflow-hidden rounded-card border border-hair">
            <RetryTableHead />
            {data.retries.map((p) => (
              <RetryQueueRow key={p.id} payout={p} locale={locale} />
            ))}
          </div>
          <p className="text-[0.74rem] text-ink-45">
            A failed payout is never a lost payout. The money is still in
            escrow, the ledger still says whose it is, and the seller sees
            “sending” rather than silence.
          </p>

          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Audit log · every action, every actor
            </p>
            <div className="flex flex-col">
              {data.audit.map((entry) => (
                <AuditEntryRow key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 @[1000px]:sticky @[1000px]:top-[4.6rem]">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Who can do what
            </p>
            <PermissionMatrix labels={permissionLabels} />
          </div>

          <Lockbar icon="fileText">
            Append-only. Nothing in the ledger is ever edited — a correction is
            a new compensating entry, so the history of a disputed franc can
            always be reconstructed.
          </Lockbar>

          <div className="rounded-card bg-paper-2 p-4">
            <p className="m-0 mb-2 text-[0.92rem] font-bold">Reconciliation</p>
            <div className="flex flex-col text-sm">
              <div className="flex justify-between gap-3 border-b border-dashed border-hair py-1.5">
                <span className="text-ink-70">Last run</span>
                <span className="font-bold">{data.lastReconciliationLabel}</span>
              </div>
              <div className="flex justify-between gap-3 border-b border-dashed border-hair py-1.5">
                <span className="text-ink-70">Next run</span>
                <span className="font-bold">{data.nextReconciliationLabel}</span>
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <span className="text-ink-70">Entries checked</span>
                <span className="font-bold">
                  {data.entriesChecked.toLocaleString(locale)}
                </span>
              </div>
            </div>
            <ActionButton
              type="button"
              variant="line"
              size="sm"
              block
              className="mt-3"
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  const result = await runReconciliationAction();
                  toast(
                    result.ok
                      ? "Reconciliation matched"
                      : "Could not run reconciliation",
                  );
                  if (result.ok) router.refresh();
                });
              }}
            >
              Run it now
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
