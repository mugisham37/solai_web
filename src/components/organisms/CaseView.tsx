"use client";

import { useId, useMemo, useState, useTransition } from "react";
import {
  approveCaseAction,
  resolveCaseAction,
} from "@/app/actions/console/resolve";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { Lockbar } from "@/components/atoms/Lockbar";
import { MoneyDisplay } from "@/components/atoms/Money";
import { SlaChip } from "@/components/atoms/SlaChip";
import { EvidenceTimeline } from "@/components/molecules/EvidenceTimeline";
import {
  OutcomePicker,
  type OutcomeOption,
} from "@/components/molecules/OutcomePicker";
import { ReasonCodePicker } from "@/components/molecules/ReasonCodePicker";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/money";
import { can } from "@/lib/console/permissions";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useRouter } from "@/i18n/navigation";
import type {
  CaseOutcome,
  CaseReasonCode,
  ConsoleAgent,
  ConsoleDispute,
} from "@/types/console";
import type { Money } from "@/types/money";

const REASON_OPTIONS: readonly { key: CaseReasonCode; label: string }[] = [
  { key: "codeDeliveryFailure", label: "Code delivery failure" },
  { key: "itemNotReceived", label: "Item not received" },
  { key: "notAsDescribed", label: "Item not as described" },
  { key: "suspectedFraud", label: "Suspected fraud" },
  { key: "courierError", label: "Courier error" },
];

type CaseViewProps = {
  dispute: ConsoleDispute;
  agent: ConsoleAgent;
  approvalThreshold: Money;
  locale: string;
};

export function CaseView({
  dispute,
  agent,
  approvalThreshold,
  locale,
}: CaseViewProps) {
  const { toast } = useToastContext();
  const router = useRouter();
  const [outcome, setOutcome] = useState<CaseOutcome | null>(null);
  const [reasonCode, setReasonCode] = useState<CaseReasonCode | null>(null);
  const [note, setNote] = useState(
    "Delivery confirmed by courier GPS and photo. The SMS code failed at the carrier, which is our fault and not the seller’s.",
  );
  const [pending, startTransition] = useTransition();
  const idem = useId();

  const closed = dispute.state === "closed";
  const big = dispute.amount.amountMinor > approvalThreshold.amountMinor;
  const canBig = can(agent.role, "resolveBig");
  const blocked = big && !canBig;
  const awaiting = dispute.state === "awaiting_approval";

  const options: OutcomeOption[] = useMemo(() => {
    const amt = formatMoney(dispute.amount, locale);
    return [
      {
        key: "release",
        title: "Release to the seller",
        subtitle: "Delivery is proven by GPS and photo",
        actLabel: `Release ${amt} to the seller`,
        buttonVariant: "sea",
      },
      {
        key: "refund",
        title: "Refund the buyer",
        subtitle: "Back to the paying wallet, same rails",
        actLabel: `Refund ${amt} to the buyer`,
        buttonVariant: "clay",
      },
      {
        key: "split",
        title: "Split it",
        subtitle: "Partial refund, remainder released",
        actLabel: "Split the held amount",
        buttonVariant: "sun",
      },
      {
        key: "extend",
        title: "Extend the hold",
        subtitle: "Ask for more evidence first",
        actLabel: "Extend the hold by 48 hours",
        buttonVariant: "line",
      },
    ];
  }, [dispute.amount, locale]);

  const selected = options.find((o) => o.key === outcome);

  let applyLabel = "Choose an outcome first";
  if (outcome && !reasonCode) applyLabel = "Pick a reason code";
  else if (outcome && reasonCode) {
    applyLabel = blocked
      ? "Request approval from finance"
      : (selected?.actLabel ?? "Apply");
  }

  const applyDisabled = !outcome || !reasonCode || pending || closed;

  const apply = () => {
    if (!outcome || !reasonCode) return;
    startTransition(async () => {
      const result = await resolveCaseAction({
        caseId: dispute.id,
        outcome,
        reasonCode,
        note,
        idempotencyKey: `${idem}-${Date.now()}`,
      });
      if (!result.ok) {
        toast(
          result.error === "forbidden"
            ? "Not allowed for your role"
            : result.error === "duplicate"
              ? "Already submitted"
              : "Could not apply outcome",
        );
        return;
      }
      if (result.mode === "approval_requested") {
        toast("Sent to finance for a second approval");
      } else if (result.mode === "extended") {
        toast("Hold extended by 48 hours");
      } else {
        toast(`${selected?.actLabel ?? "Resolved"} · recorded on the ledger`);
      }
      router.push("/console/disputes");
      router.refresh();
    });
  };

  const approve = () => {
    startTransition(async () => {
      const result = await approveCaseAction(
        dispute.id,
        `${idem}-approve-${Date.now()}`,
      );
      if (!result.ok) {
        toast("Could not approve");
        return;
      }
      toast("Approved · both names on the ledger entry");
      router.push("/console/disputes");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
            #{dispute.id}
          </h1>
          <p className="mt-1 text-[0.74rem] text-ink-45">
            Order {dispute.orderId} · raised by the {dispute.raisedBy} ·{" "}
            {dispute.raisedByName}
          </p>
        </div>
        <SlaChip hours={dispute.slaHours} closed={closed} />
      </div>

      {/* Evidence first in DOM — outcome never above it. */}
      <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3">
          <div
            className={
              closed
                ? "rounded-card border border-sea/30 bg-sea/10 p-4"
                : "rounded-card border border-berry/30 bg-berry/10 p-4"
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p
                  className={
                    closed
                      ? "text-[0.74rem] text-sea-muted"
                      : "text-[0.74rem] text-berry-muted"
                  }
                >
                  {closed
                    ? `Resolved · ${dispute.outcome ?? ""}`
                    : "Frozen while this case is open"}
                </p>
                <p
                  className={
                    closed
                      ? "mt-1 font-display text-d2 font-extrabold text-sea-muted"
                      : "mt-1 font-display text-d2 font-extrabold text-berry-muted"
                  }
                >
                  <MoneyDisplay value={dispute.amount} locale={locale} />
                </p>
              </div>
              <div className="flex gap-4">
                <span className="flex flex-col">
                  <span className="text-[0.74rem] text-ink-45">Buyer</span>
                  <span className="text-sm font-bold">
                    {dispute.raisedBy === "buyer"
                      ? dispute.raisedByName
                      : "—"}
                  </span>
                </span>
                <span className="flex flex-col">
                  <span className="text-[0.74rem] text-ink-45">Seller</span>
                  <span className="text-sm font-bold">
                    {dispute.sellerName}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Evidence · assembled automatically
            </p>
            <EvidenceTimeline events={dispute.evidence} />
          </div>

          <div className="grid gap-2 @[700px]:grid-cols-2">
            <Link
              href={`/console/people/${dispute.sellerId}`}
              className="flex items-center gap-3 rounded-tile border border-hair bg-white p-3 hover:bg-paper-2"
            >
              <span className="grid size-[38px] place-items-center rounded-[12px] bg-paper-2">
                <Icon name="store" size="md" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.74rem] text-ink-45">
                  Seller record
                </span>
                <span className="block text-[0.92rem] font-bold">
                  {dispute.sellerName}
                </span>
              </span>
              <Icon name="chevronRight" size="sm" className="text-ink-45" />
            </Link>
            <Link
              href={
                dispute.buyerId
                  ? `/console/people/${dispute.buyerId}`
                  : "/console/people"
              }
              className="flex items-center gap-3 rounded-tile border border-hair bg-white p-3 hover:bg-paper-2"
            >
              <span className="grid size-[38px] place-items-center rounded-[12px] bg-paper-2">
                <Icon name="user" size="md" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.74rem] text-ink-45">
                  Buyer record
                </span>
                <span className="block text-[0.92rem] font-bold">
                  {dispute.raisedByName}
                </span>
              </span>
              <Icon name="chevronRight" size="sm" className="text-ink-45" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 @[1000px]:sticky @[1000px]:top-[4.6rem]">
          {closed ? (
            <div className="rounded-card border border-hair bg-white p-4">
              <p className="mb-2 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
                Outcome
              </p>
              <p className="text-[0.92rem] font-bold">
                {dispute.outcome ?? "Resolved"}
              </p>
              <p className="mt-2 text-[0.74rem] text-ink-45">
                Recorded on the ledger with the reason code and the agent name.
                It cannot be edited — a correction would be a new entry.
              </p>
            </div>
          ) : awaiting && canBig ? (
            <div className="rounded-card border border-hair bg-white p-4">
              <p className="mb-2 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
                Approval requested
              </p>
              <p className="text-sm text-ink-70">
                {dispute.pendingApproval?.requestedByName} requested{" "}
                <span className="font-bold text-ink">
                  {dispute.pendingApproval?.outcome}
                </span>{" "}
                · {dispute.pendingApproval?.reasonCode}
              </p>
              <ActionButton
                type="button"
                variant="sun"
                size="lg"
                block
                className="mt-4"
                disabled={pending}
                aria-label={`Approve and ${dispute.pendingApproval?.outcome} ${formatMoney(dispute.amount, locale)}`}
                onClick={approve}
              >
                Approve as second name
              </ActionButton>
            </div>
          ) : (
            <div className="rounded-card border border-hair bg-white p-4">
              <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
                Outcome
              </p>
              <OutcomePicker
                options={options}
                value={outcome}
                onChange={setOutcome}
                disabled={awaiting}
              />
              <div className="mt-4">
                <ReasonCodePicker
                  options={REASON_OPTIONS}
                  value={reasonCode}
                  onChange={(v) => setReasonCode(v as CaseReasonCode)}
                  disabled={awaiting}
                />
              </div>
              <label className="mt-4 flex flex-col gap-1.5">
                <span className="text-[0.73rem] font-bold tracking-wide text-ink-45 uppercase">
                  Note to both parties
                </span>
                <textarea
                  className="min-h-20 rounded-xl border border-ink-20 bg-white px-3 py-3 text-[0.95rem] leading-snug outline-none focus:border-sun focus:ring-[3px] focus:ring-sun/20"
                  value={note}
                  disabled={awaiting}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <ActionButton
                type="button"
                variant={
                  blocked
                    ? "line"
                    : selected
                      ? selected.buttonVariant
                      : "sun"
                }
                size="lg"
                block
                className="mt-4"
                disabled={applyDisabled || awaiting}
                aria-label={applyLabel}
                onClick={apply}
              >
                {awaiting ? "Waiting on finance" : applyLabel}
              </ActionButton>
              <p className="mt-2 text-[0.74rem] text-ink-45">
                {big ? (
                  blocked ? (
                    <>
                      <span className="font-bold text-clay">
                        Above {formatMoney(approvalThreshold, locale)}.
                      </span>{" "}
                      Your role cannot resolve this alone — you can request
                      approval from finance.
                    </>
                  ) : (
                    <>
                      Above {formatMoney(approvalThreshold, locale)}. Both
                      approver names go on the ledger entry.
                    </>
                  )
                ) : (
                  <>
                    Anything above {formatMoney(approvalThreshold, locale)}{" "}
                    needs a second approver.
                  </>
                )}
              </p>
            </div>
          )}

          <Lockbar icon="scale">
            <span>
              You pick an{" "}
              <span className="font-bold text-on-deep">outcome</span>, never an
              amount and never a destination. Both are already fixed by the
              order and the paying wallet.
            </span>
          </Lockbar>

          <div className="rounded-card bg-paper-2 p-4">
            <p className="m-0 mb-1.5 text-[0.92rem] font-bold">
              Evidence before action
            </p>
            <p className="m-0 text-[0.74rem] text-ink-45">
              On a wide screen the outcome panel sits beside the timeline, never
              above it. On a phone the timeline comes first for the same reason.
            </p>
          </div>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {pending ? "Applying outcome" : ""}
      </span>
    </div>
  );
}
