import { can, requireCapability } from "@/lib/console/permissions";
import {
  CASE_REASON_LABELS,
  LISTING_REASON_LABELS,
  OUTCOME_LABELS,
  createConsoleSeed,
  type ConsoleSeed,
} from "@/lib/console/mock";
import {
  breachCount,
  disputeFilterCounts,
  failedPayoutCount,
  frozenTotal,
  listingFilterCounts,
  openDisputeCount,
  peopleFilterCounts,
  reconciliationDifference,
  sortBySlaAscending,
} from "@/lib/console/derive";
import type {
  ConsoleAgent,
  ConsoleAuditEntry,
  ConsoleService,
  DisputeListQuery,
  GraduatedControls,
  ListingListQuery,
  ListingTakedownReason,
  MarketCode,
  PeopleListQuery,
  ResolveCaseInput,
  UnmaskField,
} from "@/types/console";
import type { CurrencyCode, Money } from "@/types/money";

function money(amountMinor: number, currency: CurrencyCode = "RWF"): Money {
  return { amountMinor, currency };
}

function formatRwf(amount: Money): string {
  return `RWF ${amount.amountMinor.toLocaleString("en")}`;
}

let seed: ConsoleSeed = createConsoleSeed();
let auditSeq = 100;

function appendAudit(
  entry: Omit<ConsoleAuditEntry, "id">,
): ConsoleAuditEntry {
  const full: ConsoleAuditEntry = {
    ...entry,
    id: `aud-${++auditSeq}`,
  };
  seed.audit = [full, ...seed.audit];
  return full;
}

function findDispute(caseId: string) {
  return seed.disputes.find((d) => d.id === caseId);
}

function findPerson(personId: string) {
  return seed.people.find((p) => p.id === personId);
}

function findListing(listingId: string) {
  return seed.listings.find((l) => l.id === listingId);
}

function applyOutcome(
  caseId: string,
  outcome: ResolveCaseInput["outcome"],
  reasonCode: ResolveCaseInput["reasonCode"],
  note: string,
  agent: ConsoleAgent,
  approver?: ConsoleAgent,
) {
  const d = findDispute(caseId);
  if (!d) return { ok: false as const, error: "not_found" as const };

  const label = OUTCOME_LABELS[outcome] ?? outcome;
  const reasonLabel = CASE_REASON_LABELS[reasonCode] ?? reasonCode;
  const ledgerId = `LG-${88140 + seed.audit.length}`;

  if (outcome === "extend") {
    const next = seed.disputes.map((row) =>
      row.id === caseId
        ? {
            ...row,
            slaHours: row.slaHours + 48,
            pendingApproval: undefined,
            note,
            reasonCode,
          }
        : row,
    );
    seed.disputes = next;
    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `${label} on #${caseId}`,
      detail: `${formatRwf(d.amount)} · reason: ${reasonLabel} · ledger ${ledgerId}${approver ? ` · approved by ${approver.name}` : ""}`,
      tone: "hold",
      target: caseId,
    });
    return { ok: true as const, mode: "extended" as const };
  }

  const next = seed.disputes.map((row) =>
    row.id === caseId
      ? {
          ...row,
          state: "closed" as const,
          outcome: label,
          outcomeCode: outcome,
          reasonCode,
          note,
          resolvedBy: agent.name,
          approvedBy: approver?.name,
          pendingApproval: undefined,
        }
      : row,
  );
  seed.disputes = next;

  appendAudit({
    timeLabel: "now",
    actorName: agent.name,
    actorRole: agent.role,
    action: `${label} on #${caseId}`,
    detail: `${formatRwf(d.amount)} · reason: ${reasonLabel} · ledger ${ledgerId}${approver ? ` · approved by ${approver.name}` : ""} · parties notified`,
    tone: outcome === "refund" ? "bad" : outcome === "release" ? "ok" : "hold",
    target: caseId,
  });

  return { ok: true as const, mode: "resolved" as const };
}

export const consoleStore: ConsoleService = {
  async getAgent() {
    return null;
  },

  async setAgent() {
    /* session is cookie-backed */
  },

  async getOverview() {
    const open = seed.disputes.filter((d) => d.state !== "closed");
    const urgent = sortBySlaAscending(open).slice(0, 3);
    return {
      heldInEscrow: seed.ledgerBalance,
      heldOrderCount: seed.heldOrderCount,
      releasedToday: seed.releasedToday,
      releasedTodayCount: seed.releasedTodayCount,
      openDisputes: openDisputeCount(seed.disputes),
      frozenTotal: frozenTotal(seed.disputes),
      breachingCount: breachCount(seed.disputes),
      urgentCases: urgent,
      rails: seed.rails,
      failedPayouts: failedPayoutCount(seed.payouts),
      lastReconciliationLabel: seed.lastReconciliationLabel,
      nextReconciliationLabel: seed.nextReconciliationLabel,
      reconciliationMatched:
        seed.ledgerBalance.amountMinor === seed.merchantStatement.amountMinor,
      autoSignals: [
        {
          id: "sig-geo",
          kind: "geo" as const,
          title: "Delivery code entered 4.2 km from the address",
          detail:
            "Order 1058 · courier MT-114 · funds auto-held pending review",
          personId: "SEL-6620",
        },
        {
          id: "sig-cap",
          kind: "cap" as const,
          title: "New seller above the value cap",
          detail:
            "RWF 180,000 order on a seller with 1 completed delivery. Hold extended to 7 days automatically.",
          personId: "SEL-6620",
        },
      ],
    };
  },

  async getDisputes(query: DisputeListQuery) {
    const q = query.q?.toLowerCase();
    let rows = seed.disputes.filter((d) => {
      if (query.filter !== "all" && d.state !== query.filter) return false;
      if (!q) return true;
      const hay =
        `${d.id} ${d.raisedByName} ${d.reasonLabel} ${d.sellerName} ${d.orderId}`.toLowerCase();
      return hay.includes(q);
    });
    rows = sortBySlaAscending(rows);
    return {
      rows,
      counts: disputeFilterCounts(seed.disputes),
      openCount: openDisputeCount(seed.disputes),
      frozenTotal: frozenTotal(seed.disputes),
      medianFirstReplyLabel: "3h 10m",
      outcomeSplit: {
        refundedPercent: 41,
        releasedPercent: 46,
        splitPercent: 13,
      },
    };
  },

  async getDispute(caseId) {
    return findDispute(caseId) ?? null;
  },

  async getPeople(query: PeopleListQuery) {
    const q = query.q?.toLowerCase();
    const rows = seed.people.filter((p) => {
      if (query.filter === "seller" || query.filter === "buyer") {
        if (p.kind !== query.filter) return false;
      } else if (query.filter === "watch" || query.filter === "suspended") {
        if (p.status !== query.filter) return false;
      }
      if (!q) return true;
      return `${p.name} ${p.id} ${p.city}`.toLowerCase().includes(q);
    });
    return { rows, counts: peopleFilterCounts(seed.people) };
  },

  async getPerson(personId) {
    return findPerson(personId) ?? null;
  },

  async getListings(query: ListingListQuery) {
    const rows = seed.listings.filter(
      (l) => query.filter === "all" || l.state === query.filter,
    );
    return {
      rows,
      counts: listingFilterCounts(seed.listings),
      whatsappHealth: {
        spamComplaints7d: 4,
        templateRating: "High" as const,
        numbersAtRisk: 1,
      },
    };
  },

  async getLedger() {
    return {
      ledgerBalance: seed.ledgerBalance,
      merchantStatement: seed.merchantStatement,
      difference: reconciliationDifference(
        seed.ledgerBalance,
        seed.merchantStatement,
      ),
      failedPayouts: failedPayoutCount(seed.payouts),
      retries: seed.payouts,
      audit: seed.audit,
      lastReconciliationLabel: seed.lastReconciliationLabel,
      nextReconciliationLabel: seed.nextReconciliationLabel,
      entriesChecked: seed.entriesChecked,
    };
  },

  async getRules() {
    return seed.rules;
  },

  async getBreachCount() {
    return breachCount(seed.disputes);
  },

  async getApprovalThreshold(currency: CurrencyCode = "RWF") {
    const rw = seed.rules.find((r) => r.market === "RW" && r.live);
    return rw?.approvalThreshold ?? money(100_000, currency);
  },

  async resolveCase(input, agent) {
    const gate = requireCapability(agent.role, "resolve");
    if (!gate.ok) return gate;

    const idemKey = `${input.caseId}:${input.idempotencyKey}`;
    if (seed.resolveIdempotency.has(idemKey)) {
      return { ok: false, error: "duplicate" };
    }

    const d = findDispute(input.caseId);
    if (!d) return { ok: false, error: "not_found" };
    if (d.state === "closed") return { ok: false, error: "closed" };
    if (!input.outcome || !input.reasonCode) {
      return { ok: false, error: "validation" };
    }

    const threshold = await this.getApprovalThreshold(d.amount.currency);
    const big = d.amount.amountMinor > threshold.amountMinor;
    const canBig = can(agent.role, "resolveBig");

    if (big && !canBig) {
      seed.disputes = seed.disputes.map((row) =>
        row.id === input.caseId
          ? {
              ...row,
              state: "awaiting_approval" as const,
              pendingApproval: {
                outcome: input.outcome,
                reasonCode: input.reasonCode,
                note: input.note,
                requestedBy: agent.id,
                requestedByName: agent.name,
              },
            }
          : row,
      );
      appendAudit({
        timeLabel: "now",
        actorName: agent.name,
        actorRole: agent.role,
        action: `Requested approval on #${d.id}`,
        detail: `${formatRwf(d.amount)} · ${input.outcome} · ${CASE_REASON_LABELS[input.reasonCode]}`,
        tone: "hold",
        target: d.id,
      });
      seed.resolveIdempotency.set(idemKey, true);
      return { ok: true, mode: "approval_requested" };
    }

    const result = applyOutcome(
      input.caseId,
      input.outcome,
      input.reasonCode,
      input.note,
      agent,
    );
    if (result.ok) seed.resolveIdempotency.set(idemKey, true);
    return result;
  },

  async approveCase(caseId, agent, idempotencyKey) {
    const gate = requireCapability(agent.role, "resolveBig");
    if (!gate.ok) return gate;

    const idemKey = `${caseId}:approve:${idempotencyKey}`;
    if (seed.resolveIdempotency.has(idemKey)) {
      return { ok: false, error: "duplicate" };
    }

    const d = findDispute(caseId);
    if (!d) return { ok: false, error: "not_found" };
    if (!d.pendingApproval) return { ok: false, error: "validation" };

    const requester: ConsoleAgent = {
      id: d.pendingApproval.requestedBy,
      name: d.pendingApproval.requestedByName,
      initials: d.pendingApproval.requestedByName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2),
      role: "support",
    };

    const result = applyOutcome(
      caseId,
      d.pendingApproval.outcome,
      d.pendingApproval.reasonCode,
      d.pendingApproval.note,
      requester,
      agent,
    );
    if (result.ok) seed.resolveIdempotency.set(idemKey, true);
    return result;
  },

  async unmaskIdentity(personId, field: UnmaskField, reason, agent) {
    const gate = requireCapability(agent.role, "unmask");
    if (!gate.ok) return gate;
    if (!reason.trim()) return { ok: false, error: "validation" };

    const p = findPerson(personId);
    if (!p) return { ok: false, error: "not_found" };

    // Log BEFORE reveal — a failure mid-request cannot produce an unlogged reveal.
    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `Unmasked ${field}`,
      detail: `${personId} · reason: ${reason.trim()} · retained 90 days`,
      tone: "bad",
      target: personId,
    });

    const value =
      field === "phone"
        ? p.phoneFull
        : field === "wallet"
          ? p.walletFull
          : p.holderFull;

    return { ok: true, value };
  },

  async setGraduatedControl(personId, key: keyof GraduatedControls, value, agent) {
    const p = findPerson(personId);
    if (!p) return { ok: false, error: "not_found" };

    seed.people = seed.people.map((row) =>
      row.id === personId
        ? { ...row, controls: { ...row.controls, [key]: value } }
        : row,
    );

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `${value ? "Enabled" : "Disabled"} ${key} on ${personId}`,
      detail: "Graduated control, no funds moved",
      tone: "hold",
      target: personId,
    });

    return { ok: true };
  },

  async setWatchFlag(personId, flag, agent) {
    const p = findPerson(personId);
    if (!p) return { ok: false, error: "not_found" };

    seed.people = seed.people.map((row) =>
      row.id === personId
        ? {
            ...row,
            status: row.status === "suspended" ? row.status : "watch",
            flags: row.flags.includes(flag) ? row.flags : [...row.flags, flag],
          }
        : row,
    );

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `Added watch flag on ${personId}`,
      detail: flag,
      tone: "hold",
      target: personId,
    });

    return { ok: true };
  },

  async suspendAccount(personId, agent) {
    const gate = requireCapability(agent.role, "suspend");
    if (!gate.ok) return gate;

    const p = findPerson(personId);
    if (!p) return { ok: false, error: "not_found" };

    seed.people = seed.people.map((row) =>
      row.id === personId ? { ...row, status: "suspended" as const } : row,
    );

    seed.blocklist.push({
      phone: p.phoneFull,
      wallet: p.walletFull,
      deviceFingerprint: `fp-${personId}`,
      personId,
      at: new Date().toISOString(),
    });

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `Suspended ${personId}`,
      detail: `${p.name} · held funds untouched · blocklist written`,
      tone: "bad",
      target: personId,
    });

    return { ok: true };
  },

  async reinstateAccount(personId, agent) {
    const gate = requireCapability(agent.role, "suspend");
    if (!gate.ok) return gate;

    const p = findPerson(personId);
    if (!p) return { ok: false, error: "not_found" };

    seed.people = seed.people.map((row) =>
      row.id === personId ? { ...row, status: "active" as const } : row,
    );
    seed.blocklist = seed.blocklist.filter((b) => b.personId !== personId);

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `Reinstated ${personId}`,
      detail: `${p.name} · held funds untouched`,
      tone: "ok",
      target: personId,
    });

    return { ok: true };
  },

  async takedownListing(listingId, reason: ListingTakedownReason, agent) {
    const gate = requireCapability(agent.role, "takedown");
    if (!gate.ok) return gate;

    const listing = findListing(listingId);
    if (!listing) return { ok: false, error: "not_found" };

    const reasonLabel = LISTING_REASON_LABELS[reason];

    seed.listings = seed.listings.map((row) =>
      row.id === listingId
        ? {
            ...row,
            state: "down" as const,
            reasonLabel,
            storefrontHidden: true,
            catalogueWithdrawn: true,
            adsPaused: true,
            ordersHeld: true,
            source: "Taken down just now",
            note: `Seller notified with the rule text (${reasonLabel}). Appeal window open.`,
          }
        : row,
    );

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `Took down ${listingId}`,
      detail: `${reasonLabel} · storefront hidden · WhatsApp catalogue withdrawn · ads paused · paid orders held`,
      tone: "bad",
      target: listingId,
    });

    return { ok: true };
  },

  async keepListing(listingId, agent) {
    const listing = findListing(listingId);
    if (!listing) return { ok: false, error: "not_found" };

    seed.listings = seed.listings.filter((row) => row.id !== listingId);

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `Kept listing ${listingId}`,
      detail: listing.title,
      tone: "ok",
      target: listingId,
    });

    return { ok: true };
  },

  async restoreListing(listingId, agent) {
    const gate = requireCapability(agent.role, "takedown");
    if (!gate.ok) return gate;

    const listing = findListing(listingId);
    if (!listing) return { ok: false, error: "not_found" };

    seed.listings = seed.listings.map((row) =>
      row.id === listingId
        ? {
            ...row,
            state: "reported" as const,
            storefrontHidden: false,
            catalogueWithdrawn: false,
            adsPaused: false,
            ordersHeld: false,
            source: "Restored",
            note: "Restored after appeal or review.",
          }
        : row,
    );

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `Restored ${listingId}`,
      detail: listing.title,
      tone: "ok",
      target: listingId,
    });

    return { ok: true };
  },

  async retryDisbursement(payoutId, agent) {
    const payout = seed.payouts.find((p) => p.id === payoutId);
    if (!payout) return { ok: false, error: "not_found" };

    seed.payouts = seed.payouts.map((row) =>
      row.id === payoutId
        ? {
            ...row,
            attempts: row.attempts + 1,
            state: "settled" as const,
          }
        : row,
    );

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `Retried disbursement ${payoutId}`,
      detail: `${formatRwf(payout.amount)} · ${payout.sellerName}`,
      tone: "ok",
      target: payoutId,
    });

    return { ok: true };
  },

  async retryAllDisbursements(agent) {
    const failing = seed.payouts.filter((p) => p.state === "retrying");
    seed.payouts = seed.payouts.map((row) =>
      row.state === "retrying"
        ? { ...row, attempts: row.attempts + 1, state: "settled" as const }
        : row,
    );

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: "Retried all failed disbursements",
      detail: `${failing.length} payouts`,
      tone: "ok",
    });

    return { ok: true };
  },

  async runReconciliation(agent) {
    seed.lastReconciliationLabel = "just now · matched";
    seed.entriesChecked = seed.entriesChecked + 12;

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: "Reconciliation run · matched",
      detail: `${seed.entriesChecked} entries · 0 differences`,
      tone: "ok",
    });

    return { ok: true };
  },

  async updateMarketRules(market: MarketCode, patch, agent) {
    const gate = requireCapability(agent.role, "rules");
    if (!gate.ok) return gate;

    const current = seed.rules.find((r) => r.market === market);
    if (!current) return { ok: false, error: "not_found" };
    if (!current.live) return { ok: false, error: "not_live" };

    seed.rules = seed.rules.map((row) => {
      if (row.market !== market) return row;
      return {
        ...row,
        version: row.version + 1,
        confirmationWindowHours:
          patch.confirmationWindowHours ?? row.confirmationWindowHours,
        deliverySlaDays: patch.deliverySlaDays ?? row.deliverySlaDays,
        newSellerReservePercent:
          patch.newSellerReservePercent ?? row.newSellerReservePercent,
        newSellerOrderCap: patch.newSellerOrderCap ?? row.newSellerOrderCap,
        approvalThreshold:
          patch.approvalThresholdMinor !== undefined
            ? money(patch.approvalThresholdMinor, row.approvalThreshold.currency)
            : row.approvalThreshold,
        disputeAnswerHours:
          patch.disputeAnswerHours ?? row.disputeAnswerHours,
      };
    });

    appendAudit({
      timeLabel: "now",
      actorName: agent.name,
      actorRole: agent.role,
      action: `Updated rules for ${market}`,
      detail: `New version ${current.version + 1} · never applies retroactively`,
      tone: "hold",
      target: market,
    });

    return { ok: true };
  },

  async exportDisputesCsv(query: DisputeListQuery) {
    const { rows } = await this.getDisputes(query);
    const header = "id,order,raisedBy,who,reason,amount,slaHours,state";
    const lines = rows.map(
      (d) =>
        `${d.id},${d.orderId},${d.raisedBy},${JSON.stringify(d.raisedByName)},${JSON.stringify(d.reasonLabel)},${d.amount.amountMinor},${d.slaHours},${d.state}`,
    );
    return [header, ...lines].join("\n");
  },
};

/** Test helper — reset mutable mock state. */
export function resetConsoleStore() {
  seed = createConsoleSeed();
  auditSeq = 100;
}
