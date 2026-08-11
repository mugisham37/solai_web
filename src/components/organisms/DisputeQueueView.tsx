"use client";

import { useTransition } from "react";
import { exportDisputesCsvAction } from "@/app/actions/console/ledger";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { KpiTile } from "@/components/atoms/KpiTile";
import { MoneyDisplay } from "@/components/atoms/Money";
import {
  CaseFilters,
  CaseRow,
  CaseTableHead,
} from "@/components/molecules/CaseRow";
import type { DisputeListResult } from "@/types/console";

const FILTER_KEYS = [
  { key: "open", label: "Open" },
  { key: "waiting", label: "Waiting on buyer" },
  { key: "escalated", label: "Escalated" },
  { key: "awaiting_approval", label: "Awaiting approval" },
  { key: "closed", label: "Closed" },
  { key: "all", label: "All" },
] as const;

type DisputeQueueViewProps = {
  data: DisputeListResult;
  filter: string;
  q?: string;
  locale: string;
};

export function DisputeQueueView({
  data,
  filter,
  q,
  locale,
}: DisputeQueueViewProps) {
  const [pending, startTransition] = useTransition();

  const exportCsv = () => {
    startTransition(async () => {
      const result = await exportDisputesCsvAction(filter, q);
      if (!result.ok) return;
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "disputes.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
            Disputes
          </h1>
          <p className="mt-1 text-[0.74rem] text-ink-45">
            {data.openCount} open ·{" "}
            <MoneyDisplay value={data.frozenTotal} locale={locale} /> frozen ·
            median first reply {data.medianFirstReplyLabel}
          </p>
        </div>
        <ActionButton
          type="button"
          variant="line"
          size="sm"
          disabled={pending}
          onClick={exportCsv}
        >
          <Icon name="download" size="sm" />
          Export
        </ActionButton>
      </div>

      <CaseFilters
        active={filter}
        counts={data.counts}
        keys={[...FILTER_KEYS]}
      />

      {q ? (
        <p className="text-[0.74rem] text-ink-45">Matching “{q}”</p>
      ) : null}

      {data.rows.length ? (
        <div className="overflow-hidden rounded-card border border-hair">
          <CaseTableHead />
          {data.rows.map((d) => (
            <CaseRow key={d.id} dispute={d} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-card border border-hair bg-white px-6 py-12 text-center">
          <Icon name="scale" size="lg" className="text-ink-45" />
          <p className="mt-3 font-display text-d3 font-bold text-ink">
            Nothing in this queue
          </p>
          <p className="mt-1 max-w-[36ch] text-sm text-ink-70">
            {filter === "open"
              ? "No open disputes. Every franc we hold is either moving or settled."
              : "No cases match this filter."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2.5 @[700px]:grid-cols-3">
        <KpiTile
          label="Refunded to buyer · 30d"
          value={`${data.outcomeSplit.refundedPercent}%`}
        />
        <KpiTile
          label="Released to seller · 30d"
          value={`${data.outcomeSplit.releasedPercent}%`}
        />
        <KpiTile
          label="Split · 30d"
          value={`${data.outcomeSplit.splitPercent}%`}
        />
      </div>

      <div className="flex gap-2 rounded-xl bg-paper-2 px-3.5 py-3 text-[0.81rem] text-ink-70">
        <Icon name="info" size="sm" className="mt-0.5 shrink-0" />
        <span>
          This queue is sorted by{" "}
          <span className="font-bold text-ink">
            time left against the 48-hour promise
          </span>
          , never by age. A queue sorted by age is how a published promise
          quietly becomes a lie. The three-way split above is the earliest
          warning of a fraud wave or a policy that is too harsh.
        </span>
      </div>
    </div>
  );
}
