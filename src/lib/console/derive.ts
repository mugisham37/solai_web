import type {
  ConsoleDispute,
  ConsoleRetryPayout,
  DisputeFilter,
  ListingFilter,
  PeopleFilter,
  ConsoleListing,
  ConsolePerson,
} from "@/types/console";
import type { CurrencyCode, Money } from "@/types/money";

function money(amountMinor: number, currency: CurrencyCode = "RWF"): Money {
  return { amountMinor, currency };
}

/** Open = not closed. Awaiting approval still counts as open work. */
export function isOpenCase(d: ConsoleDispute): boolean {
  return d.state !== "closed";
}

/** Badge = cases about to breach the 48h promise, not total open. */
export function breachCount(disputes: readonly ConsoleDispute[]): number {
  let n = 0;
  for (const d of disputes) {
    if (isOpenCase(d) && d.slaHours <= 6) n += 1;
  }
  return n;
}

export function openDisputeCount(disputes: readonly ConsoleDispute[]): number {
  let n = 0;
  for (const d of disputes) {
    if (isOpenCase(d)) n += 1;
  }
  return n;
}

export function frozenTotal(
  disputes: readonly ConsoleDispute[],
  currency: CurrencyCode = "RWF",
): Money {
  let sum = 0;
  for (const d of disputes) {
    if (isOpenCase(d)) sum += d.amount.amountMinor;
  }
  return money(sum, currency);
}

export function sortBySlaAscending(
  disputes: readonly ConsoleDispute[],
): ConsoleDispute[] {
  return [...disputes].sort((a, b) => a.slaHours - b.slaHours);
}

export function disputeFilterCounts(
  disputes: readonly ConsoleDispute[],
): Record<DisputeFilter, number> {
  const counts: Record<DisputeFilter, number> = {
    all: disputes.length,
    open: 0,
    waiting: 0,
    escalated: 0,
    closed: 0,
    awaiting_approval: 0,
  };
  for (const d of disputes) {
    counts[d.state] += 1;
  }
  return counts;
}

export function peopleFilterCounts(
  people: readonly ConsolePerson[],
): Record<PeopleFilter, number> {
  const counts: Record<PeopleFilter, number> = {
    all: people.length,
    seller: 0,
    buyer: 0,
    watch: 0,
    suspended: 0,
  };
  for (const p of people) {
    counts[p.kind] += 1;
    if (p.status === "watch") counts.watch += 1;
    if (p.status === "suspended") counts.suspended += 1;
  }
  return counts;
}

export function listingFilterCounts(
  listings: readonly ConsoleListing[],
): Record<ListingFilter, number> {
  const counts: Record<ListingFilter, number> = {
    all: listings.length,
    reported: 0,
    appeal: 0,
    down: 0,
  };
  for (const l of listings) {
    counts[l.state] += 1;
  }
  return counts;
}

export function failedPayoutCount(
  payouts: readonly ConsoleRetryPayout[],
): number {
  let n = 0;
  for (const p of payouts) {
    if (p.state === "retrying") n += 1;
  }
  return n;
}

export function reconciliationDifference(
  ledgerBalance: Money,
  merchantStatement: Money,
): Money {
  return money(
    ledgerBalance.amountMinor - merchantStatement.amountMinor,
    ledgerBalance.currency,
  );
}

export function slaLevel(
  hours: number,
): "breached" | "urgent" | "soon" | "normal" {
  if (hours < 0) return "breached";
  if (hours <= 6) return "urgent";
  if (hours <= 24) return "soon";
  return "normal";
}
