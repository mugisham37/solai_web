"use client";

import { useTransition } from "react";
import { retryDisbursementAction } from "@/app/actions/console/ledger";
import { ActionButton } from "@/components/atoms/ActionButton";
import { StatusChip } from "@/components/atoms/StatusChip";
import { MoneyDisplay } from "@/components/atoms/Money";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { ConsoleRetryPayout } from "@/types/console";

type RetryQueueRowProps = {
  payout: ConsoleRetryPayout;
  locale: string;
  className?: string;
};

export function RetryQueueRow({
  payout,
  locale,
  className,
}: RetryQueueRowProps) {
  const { toast } = useToastContext();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const settled = payout.state === "settled";

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-1 border-b border-hair bg-white px-3.5 py-3",
        "@[860px]:grid-cols-[1.1fr_1.2fr_1fr_1fr_auto] @[860px]:items-center @[860px]:gap-3",
        className,
      )}
    >
      <span
        className="flex items-center justify-between gap-2 text-sm before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Payout"
      >
        <span className="font-bold">{payout.id}</span>
      </span>
      <span
        className="flex items-center justify-between gap-2 text-sm text-ink-70 before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Seller"
      >
        {payout.sellerName}
      </span>
      <span
        className="flex items-center justify-between gap-2 text-sm before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Amount"
      >
        <MoneyDisplay value={payout.amount} locale={locale} />
      </span>
      <span
        className="flex items-center justify-between gap-2 before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Tries"
      >
        {settled ? (
          <StatusChip label="Settled" tone="live" />
        ) : (
          <StatusChip
            label={`${payout.attempts} · retrying`}
            tone="clay"
          />
        )}
      </span>
      <span className="flex justify-end">
        {!settled ? (
          <ActionButton
            type="button"
            variant="line"
            size="sm"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const result = await retryDisbursementAction(payout.id);
                toast(result.ok ? "Retry sent" : "Could not retry");
                if (result.ok) router.refresh();
              });
            }}
          >
            Retry
          </ActionButton>
        ) : null}
      </span>
    </div>
  );
}

export function RetryTableHead({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "hidden grid-cols-[1.1fr_1.2fr_1fr_1fr_auto] gap-3 border-b border-hair px-3.5 py-2 text-[0.68rem] font-bold tracking-wide text-ink-45 uppercase @[860px]:grid",
        className,
      )}
    >
      <span>Payout</span>
      <span>Seller</span>
      <span>Amount</span>
      <span>Attempts</span>
      <span />
    </div>
  );
}
