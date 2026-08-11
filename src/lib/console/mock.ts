import type {
  ConsoleAuditEntry,
  ConsoleDispute,
  ConsoleListing,
  ConsolePerson,
  ConsoleRail,
  ConsoleRetryPayout,
  MarketRules,
} from "@/types/console";
import type { Money } from "@/types/money";

const rwf = (amountMinor: number): Money => ({
  amountMinor,
  currency: "RWF",
});

function evidenceFor(
  orderId: string,
  amount: Money,
  by: "buyer" | "seller",
  summary: string,
): ConsoleDispute["evidence"] {
  const formatted = `RWF ${amount.amountMinor.toLocaleString("en")}`;
  return [
    {
      id: "ev-pay",
      timeLabel: "14:02",
      title: "Payment collected",
      detail: `MTN reference 8842-1190 · ${formatted} into the escrow account · idempotency key matched once`,
      tone: "ok",
    },
    {
      id: "ev-hold",
      timeLabel: "14:02",
      title: `Held against order ${orderId}`,
      detail:
        "Ledger entry LG-88121. Buyer’s delivery code issued and sent by SMS.",
      tone: "hold",
    },
    {
      id: "ev-sms",
      timeLabel: "14:03",
      title: "SMS delivery failed ×3",
      detail:
        "Carrier returned unreachable. The buyer never received the code — this is the cause of the case.",
      tone: "bad",
    },
    {
      id: "ev-gps",
      timeLabel: "16:38",
      title: "Courier at the address",
      detail:
        "GPS 42 m from the delivery point. Photo proof of handoff attached. Parcel signed for.",
      tone: "ok",
    },
    {
      id: "ev-code",
      timeLabel: "16:41",
      title: "Code entry failed ×2",
      detail:
        "Then rate-limited. Funds stayed held, which is the correct outcome.",
      tone: "bad",
    },
    {
      id: "ev-open",
      timeLabel: "17:10",
      title: `${by === "buyer" ? "Buyer" : "Seller"} opened the case`,
      detail: `“${summary}”`,
      tone: "",
    },
  ];
}

export type ConsoleSeed = {
  disputes: ConsoleDispute[];
  people: ConsolePerson[];
  listings: ConsoleListing[];
  payouts: ConsoleRetryPayout[];
  audit: ConsoleAuditEntry[];
  rails: ConsoleRail[];
  rules: MarketRules[];
  ledgerBalance: Money;
  merchantStatement: Money;
  heldOrderCount: number;
  releasedToday: Money;
  releasedTodayCount: number;
  lastReconciliationLabel: string;
  nextReconciliationLabel: string;
  entriesChecked: number;
  blocklist: Array<{
    phone?: string;
    wallet?: string;
    deviceFingerprint?: string;
    personId: string;
    at: string;
  }>;
  resolveIdempotency: Map<string, true>;
};

export function createConsoleSeed(): ConsoleSeed {
  const disputes: ConsoleDispute[] = [
    {
      id: "D-2291",
      orderId: "1042",
      raisedBy: "buyer",
      raisedByName: "Jean-Paul K.",
      sellerId: "SEL-4471",
      sellerName: "Amara Beads",
      buyerId: "BUY-8841",
      reasonLabel: "Code never arrived",
      amount: rwf(9700),
      slaHours: 4,
      state: "open",
      summary:
        "I have the bracelet but the code never came and she says she cannot be paid.",
      evidence: evidenceFor(
        "1042",
        rwf(9700),
        "buyer",
        "I have the bracelet but the code never came and she says she cannot be paid.",
      ),
    },
    {
      id: "D-2288",
      orderId: "1031",
      raisedBy: "buyer",
      raisedByName: "Aline M.",
      sellerId: "SEL-6620",
      sellerName: "Kigali Kicks",
      reasonLabel: "Wrong item delivered",
      amount: rwf(124000),
      slaHours: 19,
      state: "open",
      summary: "I ordered black, they sent white and a different size.",
      evidence: evidenceFor(
        "1031",
        rwf(124000),
        "buyer",
        "I ordered black, they sent white and a different size.",
      ),
    },
    {
      id: "D-2284",
      orderId: "1027",
      raisedBy: "seller",
      raisedByName: "Eric T.",
      sellerId: "SEL-5510",
      sellerName: "Eric Repairs",
      reasonLabel: "Buyer will not give the code",
      amount: rwf(6500),
      slaHours: 32,
      state: "open",
      summary: "I delivered it two days ago. He will not read the code out.",
      evidence: evidenceFor(
        "1027",
        rwf(6500),
        "seller",
        "I delivered it two days ago. He will not read the code out.",
      ),
    },
    {
      id: "D-2280",
      orderId: "1019",
      raisedBy: "buyer",
      raisedByName: "Claudine U.",
      sellerId: "SEL-7108",
      sellerName: "Herbal Home",
      buyerId: "BUY-8802",
      reasonLabel: "Never delivered · 9 days",
      amount: rwf(51000),
      slaHours: -3,
      state: "escalated",
      summary: "Nothing has arrived and she has stopped replying.",
      evidence: evidenceFor(
        "1019",
        rwf(51000),
        "buyer",
        "Nothing has arrived and she has stopped replying.",
      ),
    },
    {
      id: "D-2276",
      orderId: "1014",
      raisedBy: "buyer",
      raisedByName: "Patrick N.",
      sellerId: "SEL-4471",
      sellerName: "Amara Beads",
      reasonLabel: "Damaged on arrival",
      amount: rwf(13400),
      slaHours: 41,
      state: "waiting",
      summary: "The clasp was broken when I opened it.",
      evidence: evidenceFor(
        "1014",
        rwf(13400),
        "buyer",
        "The clasp was broken when I opened it.",
      ),
    },
    {
      id: "D-2260",
      orderId: "0994",
      raisedBy: "buyer",
      raisedByName: "Diane R.",
      sellerId: "SEL-5510",
      sellerName: "Eric Repairs",
      reasonLabel: "Item not as described",
      amount: rwf(22000),
      slaHours: 0,
      state: "closed",
      outcome: "Split",
      outcomeCode: "split",
      summary: "Screen was replaced but with a lower grade part.",
      evidence: evidenceFor(
        "0994",
        rwf(22000),
        "buyer",
        "Screen was replaced but with a lower grade part.",
      ),
    },
  ];

  const people: ConsolePerson[] = [
    {
      id: "SEL-4471",
      name: "Amara Beads",
      kind: "seller",
      since: "12 June",
      city: "Kigali",
      orders: 4,
      delivered: 3,
      disputes: 1,
      upheld: 0,
      held: rwf(9700),
      reserve: rwf(0),
      paid: rwf(24500),
      status: "active",
      phoneMasked: "+250 78• ••• •••",
      phoneFull: "+250 788 123 456",
      walletMasked: "MTN · +250 788 ••• 456",
      walletFull: "MTN · +250 788 123 456",
      holderMasked: "•••••••",
      holderFull: "U. AMARA",
      flags: [],
      controls: {
        extendHold: false,
        capOrderValue: false,
        pausePayouts: false,
        hideFromSearch: false,
      },
      activity: [
        {
          id: "a1",
          timeLabel: "Today 16:41",
          title: "Order 1042 held",
          detail: "Dispute #D-2291 opened by the buyer",
          tone: "hold",
        },
        {
          id: "a2",
          timeLabel: "Yesterday",
          title: "Order 1039 released",
          detail: "RWF 8,145 disbursed, 4s settlement",
          tone: "ok",
        },
        {
          id: "a3",
          timeLabel: "3 days ago",
          title: "Listing edited",
          detail: "Price changed 7,000 → 8,500",
          tone: "",
        },
        {
          id: "a4",
          timeLabel: "12 June",
          title: "Account created",
          detail: "Phone verified, wallet linked",
          tone: "",
        },
      ],
    },
    {
      id: "SEL-6620",
      name: "Kigali Kicks",
      kind: "seller",
      since: "2 May",
      city: "Kigali",
      orders: 38,
      delivered: 31,
      disputes: 6,
      upheld: 4,
      held: rwf(186000),
      reserve: rwf(18600),
      paid: rwf(940000),
      status: "watch",
      phoneMasked: "+250 73• ••• •••",
      phoneFull: "+250 730 118 442",
      walletMasked: "Airtel · +250 730 ••• 118",
      walletFull: "Airtel · +250 730 118 442",
      holderMasked: "•••••••",
      holderFull: "K. MUGISHA",
      flags: ["Counterfeit reports", "Dispute rate 16%"],
      controls: {
        extendHold: true,
        capOrderValue: true,
        pausePayouts: false,
        hideFromSearch: false,
      },
      activity: [
        {
          id: "k1",
          timeLabel: "Today",
          title: "Order 1058 auto-held",
          detail: "Code entered 4.2 km from the address",
          tone: "bad",
        },
        {
          id: "k2",
          timeLabel: "Yesterday",
          title: "Listing reported",
          detail: "L-3391 · Original brand sneakers",
          tone: "hold",
        },
      ],
    },
    {
      id: "SEL-7108",
      name: "Herbal Home",
      kind: "seller",
      since: "19 April",
      city: "Huye",
      orders: 12,
      delivered: 6,
      disputes: 5,
      upheld: 4,
      held: rwf(51000),
      reserve: rwf(12000),
      paid: rwf(78000),
      status: "suspended",
      phoneMasked: "+250 78• ••• •••",
      phoneFull: "+250 788 990 221",
      walletMasked: "MTN · +250 788 ••• 990",
      walletFull: "MTN · +250 788 990 221",
      holderMasked: "•••••••",
      holderFull: "M. NIYONSABA",
      flags: ["Prohibited claims", "4 upheld disputes"],
      controls: {
        extendHold: true,
        capOrderValue: true,
        pausePayouts: true,
        hideFromSearch: true,
      },
      activity: [
        {
          id: "h1",
          timeLabel: "2 days ago",
          title: "Account suspended",
          detail: "Held funds left untouched",
          tone: "bad",
        },
      ],
    },
    {
      id: "SEL-5510",
      name: "Eric Repairs",
      kind: "seller",
      since: "8 March",
      city: "Kigali",
      orders: 22,
      delivered: 20,
      disputes: 2,
      upheld: 1,
      held: rwf(6500),
      reserve: rwf(0),
      paid: rwf(186000),
      status: "active",
      phoneMasked: "+250 78• ••• •••",
      phoneFull: "+250 788 441 002",
      walletMasked: "MTN · +250 788 ••• 002",
      walletFull: "MTN · +250 788 441 002",
      holderMasked: "•••••••",
      holderFull: "E. TWAGIRIMANA",
      flags: [],
      controls: {
        extendHold: false,
        capOrderValue: false,
        pausePayouts: false,
        hideFromSearch: false,
      },
      activity: [],
    },
    {
      id: "BUY-8841",
      name: "Jean-Paul K.",
      kind: "buyer",
      since: "2 August",
      city: "Kigali",
      orders: 2,
      delivered: 1,
      disputes: 1,
      upheld: 0,
      held: rwf(9700),
      reserve: rwf(0),
      paid: rwf(0),
      status: "active",
      phoneMasked: "+250 78• ••• •••",
      phoneFull: "+250 788 902 771",
      walletMasked: "MTN · +250 788 ••• 902",
      walletFull: "MTN · +250 788 902 771",
      holderMasked: "•••••••",
      holderFull: "J. KAYITARE",
      flags: [],
      controls: {
        extendHold: false,
        capOrderValue: false,
        pausePayouts: false,
        hideFromSearch: false,
      },
      activity: [
        {
          id: "b1",
          timeLabel: "Today 17:10",
          title: "Opened dispute D-2291",
          detail: "Code never arrived",
          tone: "hold",
        },
      ],
    },
    {
      id: "BUY-8802",
      name: "Claudine U.",
      kind: "buyer",
      since: "11 July",
      city: "Kigali",
      orders: 9,
      delivered: 5,
      disputes: 4,
      upheld: 1,
      held: rwf(51000),
      reserve: rwf(0),
      paid: rwf(0),
      status: "watch",
      phoneMasked: "+250 78• ••• •••",
      phoneFull: "+250 782 331 118",
      walletMasked: "MTN · +250 782 ••• 331",
      walletFull: "MTN · +250 782 331 118",
      holderMasked: "•••••••",
      holderFull: "C. UWASE",
      flags: ["4 claims in 30 days"],
      controls: {
        extendHold: false,
        capOrderValue: true,
        pausePayouts: false,
        hideFromSearch: false,
      },
      activity: [],
    },
  ];

  const listings: ConsoleListing[] = [
    {
      id: "L-3391",
      title: "Original brand sneakers",
      sellerId: "SEL-6620",
      sellerName: "Kigali Kicks",
      price: rwf(45000),
      reasonLabel: "Counterfeit claim",
      source: "3 buyer reports",
      state: "reported",
      palette: 1,
      note: "Images match a stock photo used by 11 other listings.",
      storefrontHidden: false,
      catalogueWithdrawn: false,
      adsPaused: false,
      ordersHeld: false,
    },
    {
      id: "L-3388",
      title: "Herbal cure — diabetes",
      sellerId: "SEL-7108",
      sellerName: "Herbal Home",
      price: rwf(12000),
      reasonLabel: "Prohibited claim",
      source: "Auto-flagged",
      state: "reported",
      palette: 4,
      note: "Medical claims are a hard block, not a judgement call.",
      storefrontHidden: false,
      catalogueWithdrawn: false,
      adsPaused: false,
      ordersHeld: false,
    },
    {
      id: "L-3372",
      title: "Beaded anklet, adjustable",
      sellerId: "SEL-4471",
      sellerName: "Amara Beads",
      price: rwf(6000),
      reasonLabel: "Photo similarity",
      source: "Auto-flagged",
      state: "appeal",
      palette: 2,
      note: "Seller says the photo is their own. Similarity score is low.",
      storefrontHidden: false,
      catalogueWithdrawn: false,
      adsPaused: false,
      ordersHeld: false,
    },
    {
      id: "L-3350",
      title: "Designer bag, class A",
      sellerId: "SEL-6620",
      sellerName: "Kigali Kicks",
      price: rwf(88000),
      reasonLabel: "Counterfeit or unlicensed brand",
      source: "Taken down 2 days ago",
      state: "down",
      palette: 3,
      note: "Seller notified with the rule text. Appeal window open.",
      storefrontHidden: true,
      catalogueWithdrawn: true,
      adsPaused: true,
      ordersHeld: true,
    },
  ];

  const payouts: ConsoleRetryPayout[] = [
    {
      id: "PO-99412",
      sellerName: "Eric Repairs",
      amount: rwf(6145),
      attempts: 3,
      state: "retrying",
    },
    {
      id: "PO-99408",
      sellerName: "Chantal B.",
      amount: rwf(18900),
      attempts: 3,
      state: "retrying",
    },
    {
      id: "PO-99401",
      sellerName: "Amara Beads",
      amount: rwf(8145),
      attempts: 1,
      state: "settled",
    },
  ];

  const audit: ConsoleAuditEntry[] = [
    {
      id: "aud-1",
      timeLabel: "06:00",
      actorName: "System",
      actorRole: "system",
      action: "Reconciliation run · matched",
      detail: "1,284 entries · 0 differences",
      tone: "ok",
    },
    {
      id: "aud-2",
      timeLabel: "15:47",
      actorName: "T. Kayitesi",
      actorRole: "finance",
      action: "Unmasked a wallet number",
      detail: "Case D-2280 · approved by second reviewer · retained 90 days",
      tone: "bad",
      target: "BUY-8802",
    },
    {
      id: "aud-3",
      timeLabel: "16:04",
      actorName: "System",
      actorRole: "system",
      action: "Extended hold on order 1058",
      detail: "Rule: code entered 4.2 km from the delivery address",
      tone: "hold",
    },
  ];

  const rails: ConsoleRail[] = [
    { id: "mtn-collect", name: "MTN MoMo · collections", status: "up" },
    { id: "mtn-disburse", name: "MTN MoMo · disbursements", status: "up" },
    { id: "airtel", name: "Airtel Money", status: "degraded" },
    { id: "wa", name: "WhatsApp Business API", status: "up" },
    { id: "courier", name: "Courier network", status: "up" },
  ];

  const rules: MarketRules[] = [
    {
      market: "RW",
      live: true,
      version: 3,
      confirmationWindowHours: 72,
      deliverySlaDays: 7,
      newSellerReservePercent: 10,
      newSellerOrderCap: rwf(50000),
      approvalThreshold: rwf(100000),
      disputeAnswerHours: 48,
    },
    {
      market: "UG",
      live: false,
      version: 0,
      confirmationWindowHours: 72,
      deliverySlaDays: 7,
      newSellerReservePercent: 10,
      newSellerOrderCap: rwf(50000),
      approvalThreshold: rwf(100000),
      disputeAnswerHours: 48,
    },
    {
      market: "KE",
      live: false,
      version: 0,
      confirmationWindowHours: 72,
      deliverySlaDays: 7,
      newSellerReservePercent: 10,
      newSellerOrderCap: rwf(50000),
      approvalThreshold: rwf(100000),
      disputeAnswerHours: 48,
    },
    {
      market: "TZ",
      live: false,
      version: 0,
      confirmationWindowHours: 72,
      deliverySlaDays: 7,
      newSellerReservePercent: 10,
      newSellerOrderCap: rwf(50000),
      approvalThreshold: rwf(100000),
      disputeAnswerHours: 48,
    },
  ];

  return {
    disputes,
    people,
    listings,
    payouts,
    audit,
    rails,
    rules,
    ledgerBalance: rwf(4_820_000),
    merchantStatement: rwf(4_820_000),
    heldOrderCount: 214,
    releasedToday: rwf(1_264_500),
    releasedTodayCount: 142,
    lastReconciliationLabel: "06:00 · matched",
    nextReconciliationLabel: "18:00",
    entriesChecked: 1284,
    blocklist: [],
    resolveIdempotency: new Map(),
  };
}

export const LISTING_REASON_LABELS: Record<
  "counterfeit" | "prohibited" | "misleading" | "stolenPhotos",
  string
> = {
  counterfeit: "Counterfeit or unlicensed brand",
  prohibited: "Prohibited item or claim",
  misleading: "Misleading photos or price",
  stolenPhotos: "Someone else’s photos",
};

export const CASE_REASON_LABELS: Record<string, string> = {
  codeDeliveryFailure: "Code delivery failure",
  itemNotReceived: "Item not received",
  notAsDescribed: "Item not as described",
  suspectedFraud: "Suspected fraud",
  courierError: "Courier error",
  damaged: "Damaged on arrival",
  buyerWithholdsCode: "Buyer will not give the code",
};

export const OUTCOME_LABELS: Record<string, string> = {
  release: "Released to seller",
  refund: "Refunded to buyer",
  split: "Split",
  extend: "Hold extended",
};
