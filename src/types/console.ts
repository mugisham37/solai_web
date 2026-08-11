import type { CurrencyCode, Money } from "@/types/money";

export type ConsoleRole = "support" | "finance" | "admin";

export type ConsoleCapability =
  | "seeHeld"
  | "resolve"
  | "resolveBig"
  | "takedown"
  | "suspend"
  | "unmask"
  | "rules"
  | "moveMoney";

export type ConsoleAgent = Readonly<{
  id: string;
  name: string;
  initials: string;
  role: ConsoleRole;
}>;

export type DisputeState =
  | "open"
  | "waiting"
  | "escalated"
  | "closed"
  | "awaiting_approval";

export type DisputeFilter = "all" | DisputeState;

export type CaseOutcome = "release" | "refund" | "split" | "extend";

export type CaseReasonCode =
  | "codeDeliveryFailure"
  | "itemNotReceived"
  | "notAsDescribed"
  | "suspectedFraud"
  | "courierError"
  | "damaged"
  | "buyerWithholdsCode";

export type EvidenceTone = "ok" | "hold" | "bad" | "";

export type EvidenceEvent = Readonly<{
  id: string;
  timeLabel: string;
  title: string;
  detail: string;
  tone: EvidenceTone;
}>;

export type ConsoleDispute = Readonly<{
  id: string;
  orderId: string;
  raisedBy: "buyer" | "seller";
  raisedByName: string;
  sellerId: string;
  sellerName: string;
  buyerId?: string;
  reasonLabel: string;
  amount: Money;
  /** Hours remaining against the 48h promise. Negative = breached. */
  slaHours: number;
  state: DisputeState;
  summary: string;
  outcome?: string;
  outcomeCode?: CaseOutcome;
  reasonCode?: CaseReasonCode;
  note?: string;
  resolvedBy?: string;
  approvedBy?: string;
  evidence: readonly EvidenceEvent[];
  pendingApproval?: Readonly<{
    outcome: CaseOutcome;
    reasonCode: CaseReasonCode;
    note: string;
    requestedBy: string;
    requestedByName: string;
  }>;
}>;

export type PersonKind = "seller" | "buyer";
export type PersonStatus = "active" | "watch" | "suspended";
export type PeopleFilter = "all" | PersonKind | "watch" | "suspended";

export type GraduatedControls = Readonly<{
  extendHold: boolean;
  capOrderValue: boolean;
  pausePayouts: boolean;
  hideFromSearch: boolean;
}>;

export type ConsolePerson = Readonly<{
  id: string;
  name: string;
  kind: PersonKind;
  since: string;
  city: string;
  orders: number;
  delivered: number;
  disputes: number;
  upheld: number;
  held: Money;
  reserve: Money;
  paid: Money;
  status: PersonStatus;
  /** Always masked in list/default responses. */
  phoneMasked: string;
  phoneFull: string;
  walletMasked: string;
  walletFull: string;
  holderMasked: string;
  holderFull: string;
  flags: readonly string[];
  controls: GraduatedControls;
  activity: readonly EvidenceEvent[];
}>;

export type ListingState = "reported" | "appeal" | "down";
export type ListingFilter = "all" | ListingState;

export type ListingTakedownReason =
  | "counterfeit"
  | "prohibited"
  | "misleading"
  | "stolenPhotos";

export type ConsoleListing = Readonly<{
  id: string;
  title: string;
  sellerId: string;
  sellerName: string;
  price: Money;
  reasonLabel: string;
  source: string;
  state: ListingState;
  palette: number;
  note: string;
  storefrontHidden: boolean;
  catalogueWithdrawn: boolean;
  adsPaused: boolean;
  ordersHeld: boolean;
}>;

export type RetryPayoutState = "retrying" | "settled";

export type ConsoleRetryPayout = Readonly<{
  id: string;
  sellerName: string;
  amount: Money;
  attempts: number;
  state: RetryPayoutState;
}>;

export type AuditTone = "ok" | "hold" | "bad" | "";

export type ConsoleAuditEntry = Readonly<{
  id: string;
  timeLabel: string;
  actorName: string;
  actorRole: ConsoleRole | "system";
  action: string;
  detail: string;
  tone: AuditTone;
  target?: string;
}>;

export type RailStatus = "up" | "degraded";

export type ConsoleRail = Readonly<{
  id: string;
  name: string;
  status: RailStatus;
}>;

export type MarketCode = "RW" | "UG" | "KE" | "TZ";

export type MarketRules = Readonly<{
  market: MarketCode;
  live: boolean;
  version: number;
  confirmationWindowHours: number;
  deliverySlaDays: number;
  newSellerReservePercent: number;
  newSellerOrderCap: Money;
  approvalThreshold: Money;
  disputeAnswerHours: number;
}>;

export type ConsoleOverviewSnapshot = Readonly<{
  heldInEscrow: Money;
  heldOrderCount: number;
  releasedToday: Money;
  releasedTodayCount: number;
  openDisputes: number;
  frozenTotal: Money;
  breachingCount: number;
  urgentCases: readonly ConsoleDispute[];
  rails: readonly ConsoleRail[];
  failedPayouts: number;
  lastReconciliationLabel: string;
  nextReconciliationLabel: string;
  reconciliationMatched: boolean;
  autoSignals: readonly Readonly<{
    id: string;
    kind: "geo" | "cap";
    title: string;
    detail: string;
    personId: string;
  }>[];
}>;

export type OutcomeSplit30d = Readonly<{
  refundedPercent: number;
  releasedPercent: number;
  splitPercent: number;
}>;

export type DisputeListQuery = Readonly<{
  filter: DisputeFilter;
  q?: string;
}>;

export type DisputeListResult = Readonly<{
  rows: readonly ConsoleDispute[];
  counts: Readonly<Record<DisputeFilter, number>>;
  openCount: number;
  frozenTotal: Money;
  medianFirstReplyLabel: string;
  outcomeSplit: OutcomeSplit30d;
}>;

export type PeopleListQuery = Readonly<{
  filter: PeopleFilter;
  q?: string;
}>;

export type PeopleListResult = Readonly<{
  rows: readonly ConsolePerson[];
  counts: Readonly<Record<PeopleFilter, number>>;
}>;

export type ListingListQuery = Readonly<{
  filter: ListingFilter;
}>;

export type ListingListResult = Readonly<{
  rows: readonly ConsoleListing[];
  counts: Readonly<Record<ListingFilter, number>>;
  whatsappHealth: Readonly<{
    spamComplaints7d: number;
    templateRating: "High" | "Medium" | "Low";
    numbersAtRisk: number;
  }>;
}>;

export type LedgerSnapshot = Readonly<{
  ledgerBalance: Money;
  merchantStatement: Money;
  difference: Money;
  failedPayouts: number;
  retries: readonly ConsoleRetryPayout[];
  audit: readonly ConsoleAuditEntry[];
  lastReconciliationLabel: string;
  nextReconciliationLabel: string;
  entriesChecked: number;
}>;

export type UnmaskField = "phone" | "wallet" | "holder";

export type ResolveCaseInput = Readonly<{
  caseId: string;
  outcome: CaseOutcome;
  reasonCode: CaseReasonCode;
  note: string;
  idempotencyKey: string;
}>;

export type ActionOk = Readonly<{ ok: true }>;
export type ActionErr<E extends string = string> = Readonly<{
  ok: false;
  error: E;
}>;

export type ResolveCaseResult =
  | Readonly<{ ok: true; mode: "resolved" | "approval_requested" | "extended" }>
  | ActionErr<"not_found" | "forbidden" | "closed" | "validation" | "duplicate">;

export type ConsoleService = {
  getAgent(): Promise<ConsoleAgent | null>;
  setAgent(agent: ConsoleAgent): Promise<void>;

  getOverview(): Promise<ConsoleOverviewSnapshot>;
  getDisputes(query: DisputeListQuery): Promise<DisputeListResult>;
  getDispute(caseId: string): Promise<ConsoleDispute | null>;
  getPeople(query: PeopleListQuery): Promise<PeopleListResult>;
  getPerson(personId: string): Promise<ConsolePerson | null>;
  getListings(query: ListingListQuery): Promise<ListingListResult>;
  getLedger(): Promise<LedgerSnapshot>;
  getRules(): Promise<readonly MarketRules[]>;
  getBreachCount(): Promise<number>;
  getApprovalThreshold(currency?: CurrencyCode): Promise<Money>;

  resolveCase(
    input: ResolveCaseInput,
    agent: ConsoleAgent,
  ): Promise<ResolveCaseResult>;
  approveCase(
    caseId: string,
    agent: ConsoleAgent,
    idempotencyKey: string,
  ): Promise<ResolveCaseResult>;

  unmaskIdentity(
    personId: string,
    field: UnmaskField,
    reason: string,
    agent: ConsoleAgent,
  ): Promise<
    | Readonly<{ ok: true; value: string }>
    | ActionErr<"not_found" | "forbidden" | "validation">
  >;

  setGraduatedControl(
    personId: string,
    key: keyof GraduatedControls,
    value: boolean,
    agent: ConsoleAgent,
  ): Promise<ActionOk | ActionErr<"not_found">>;

  setWatchFlag(
    personId: string,
    flag: string,
    agent: ConsoleAgent,
  ): Promise<ActionOk | ActionErr<"not_found">>;

  suspendAccount(
    personId: string,
    agent: ConsoleAgent,
  ): Promise<ActionOk | ActionErr<"not_found" | "forbidden">>;

  reinstateAccount(
    personId: string,
    agent: ConsoleAgent,
  ): Promise<ActionOk | ActionErr<"not_found" | "forbidden">>;

  takedownListing(
    listingId: string,
    reason: ListingTakedownReason,
    agent: ConsoleAgent,
  ): Promise<ActionOk | ActionErr<"not_found" | "forbidden">>;

  keepListing(
    listingId: string,
    agent: ConsoleAgent,
  ): Promise<ActionOk | ActionErr<"not_found">>;

  restoreListing(
    listingId: string,
    agent: ConsoleAgent,
  ): Promise<ActionOk | ActionErr<"not_found" | "forbidden">>;

  retryDisbursement(
    payoutId: string,
    agent: ConsoleAgent,
  ): Promise<ActionOk | ActionErr<"not_found">>;

  retryAllDisbursements(
    agent: ConsoleAgent,
  ): Promise<ActionOk>;

  runReconciliation(
    agent: ConsoleAgent,
  ): Promise<ActionOk>;

  updateMarketRules(
    market: MarketCode,
    patch: Partial<
      Omit<MarketRules, "market" | "live" | "version" | "approvalThreshold">
    > & { approvalThresholdMinor?: number },
    agent: ConsoleAgent,
  ): Promise<ActionOk | ActionErr<"not_found" | "forbidden" | "not_live">>;

  exportDisputesCsv(query: DisputeListQuery): Promise<string>;
};
