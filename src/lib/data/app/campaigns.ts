import type {
  AbTest,
  AgentAction,
  Audience,
  Campaign,
  ChannelAllocation,
  Creative,
} from "@/types/app";

export const campaigns: Campaign[] = [
  {
    id: "c1",
    name: "Ankara Print Tee — Indigo Launch",
    state: "live",
    stage: "Optimizing",
    channels: ["meta", "google", "whatsapp"],
    spend: 2840,
    cap: 5000,
    roas: 4.2,
    orders: 84,
    cpa: 33.81,
    lastEdit: "Optimizer · 12m ago",
  },
  {
    id: "c2",
    name: "Cape Threads Linen Collection",
    state: "live",
    stage: "Live",
    channels: ["meta", "whatsapp"],
    spend: 1290,
    cap: 3000,
    roas: 3.6,
    orders: 42,
    cpa: 30.71,
    lastEdit: "Optimizer · 47m ago",
  },
  {
    id: "c3",
    name: "Holiday Gift Bundles 2026",
    state: "learning",
    stage: "Learning",
    channels: ["meta", "google"],
    spend: 480,
    cap: 2500,
    roas: 2.1,
    orders: 9,
    cpa: 53.33,
    lastEdit: "Planner · 2h ago",
  },
  {
    id: "c4",
    name: "Diaspora Outreach — EU + UK",
    state: "paused",
    stage: "Paused",
    channels: ["meta", "google"],
    spend: 1640,
    cap: 4000,
    roas: 1.8,
    orders: 18,
    cpa: 91.11,
    lastEdit: "You · 1d ago",
  },
  {
    id: "c5",
    name: "WhatsApp Re-engagement Q1",
    state: "draft",
    stage: "Awaiting approval",
    channels: ["whatsapp"],
    spend: 0,
    cap: 1500,
    roas: null,
    orders: 0,
    cpa: null,
    lastEdit: "Planner · 6h ago",
  },
];

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

export const channelAllocations: ChannelAllocation[] = [
  {
    channel: "Meta — Reels (IG)",
    pct: 35,
    spend: 994,
    roas: 5.1,
    color: "#5B7CFF",
  },
  {
    channel: "Meta — Feed (FB)",
    pct: 25,
    spend: 710,
    roas: 3.8,
    color: "#7AA7FF",
  },
  {
    channel: "Google — Search",
    pct: 25,
    spend: 710,
    roas: 4.4,
    color: "#FFB547",
  },
  {
    channel: "WhatsApp — Catalog",
    pct: 15,
    spend: 426,
    roas: 3.2,
    color: "#34D399",
  },
];

export const audiences: Audience[] = [
  {
    name: "Women 25–34 · East Africa",
    size: "~280K",
    cpa: 24.1,
    status: "scaling",
  },
  {
    name: "Diaspora · EU + UK · Fashion intent",
    size: "~140K",
    cpa: 38.4,
    status: "steady",
  },
  {
    name: "Men 25–44 · Gift buyers · RW + KE",
    size: "~95K",
    cpa: 41.2,
    status: "learning",
  },
  {
    name: "Lookalike 1% — past 90d buyers",
    size: "~210K",
    cpa: 21.8,
    status: "scaling",
  },
];

export const agentActions: AgentAction[] = [
  {
    time: "12m ago",
    agent: "Optimizer",
    action: "Increased Reels budget +15%",
    why: {
      headline: "Reels outperforming Feed by 1.8× on CTR.",
      bullets: [
        "CPA 18% under target",
        "Feed CTR declining over 3 ticks",
        "Reels ROAS 5.1× vs Feed 3.8×",
      ],
      agent: "Real-time Optimizer",
      runId: "run_7f3a…e91c",
    },
  },
  {
    time: "47m ago",
    agent: "Optimizer",
    action: 'Paused "broad-keywords-2" ad set',
    why: {
      headline: "CTR fell below 1.5% baseline.",
      bullets: ["0.4% CTR over 45 minutes", "CPA spiked to US$ 22.80"],
      agent: "Real-time Optimizer",
      runId: "run_8b2c…d41f",
    },
  },
  {
    time: "2h ago",
    agent: "Creative",
    action: "Generated 3 Reels variants",
  },
  {
    time: "6h ago",
    agent: "Planner",
    action: "Drafted WhatsApp re-engagement campaign",
  },
];

export const creatives: Creative[] = [
  {
    id: "cr1",
    channel: "meta",
    format: "reel",
    copy: "Hand-cut indigo Ankara — made in Kigali. Free delivery.",
    ctr: 3.2,
    cpa: 6.2,
    impr: 48200,
    status: "winning",
  },
  {
    id: "cr2",
    channel: "meta",
    format: "square",
    copy: "The tee everyone's wearing in Kigali this season.",
    ctr: 2.1,
    cpa: 9.8,
    impr: 31400,
    status: "live",
  },
  {
    id: "cr3",
    channel: "google",
    format: "wide",
    copy: "Ankara Print Tee — Indigo | Inema Boutique",
    ctr: 1.8,
    cpa: 12.4,
    impr: 22800,
    status: "live",
  },
  {
    id: "cr4",
    channel: "whatsapp",
    format: "square",
    copy: "Murakoze for your order! Here's your catalog link.",
    ctr: 4.1,
    cpa: 5.8,
    impr: 8600,
    status: "winning",
  },
  {
    id: "cr5",
    channel: "meta",
    format: "reel",
    copy: "Behind the scenes at our Kigali atelier.",
    ctr: 0.9,
    cpa: 18.2,
    impr: 12400,
    status: "paused",
  },
];

export const abTests: AbTest[] = [
  {
    id: "ab1",
    name: "Reels hook: price vs craft",
    state: "running",
    variant: "A vs B",
    winner: null,
    metric: "CTR",
    a: { name: "Price hook", val: "2.8%", sample: 12400 },
    b: { name: "Craft hook", val: "3.6%", sample: 11800 },
    lift: "+28.6%",
    confidence: 72,
  },
  {
    id: "ab2",
    name: "CTA: Shop now vs Murakoze",
    state: "completed",
    variant: "A vs B",
    winner: "B",
    metric: "CPA",
    a: { name: "Shop now", val: "US$ 9.40", sample: 8200 },
    b: { name: "Murakoze", val: "US$ 6.20", sample: 7900 },
    lift: "-34.0%",
    confidence: 94,
  },
  {
    id: "ab3",
    name: "Audience: lookalike 1% vs 3%",
    state: "queued",
    variant: "A vs B",
    winner: null,
    metric: "ROAS",
    a: { name: "1% lookalike", val: "—", sample: 0 },
    b: { name: "3% lookalike", val: "—", sample: 0 },
    lift: "—",
    confidence: 0,
  },
];

export const approvalDetails = {
  channels: "WhatsApp outbound",
  budget: "US$ 1,500 cap",
  duration: "14 days",
  audience: "Repeat buyers (1,840 contacts)",
  goal: "Re-engagement · drive catalog visits",
  builtBy: "Campaign Planner",
  autoActions: [
    "Send personalised messages to repeat buyers",
    "Track reply rate and auto-pause below 5%",
    "Route high-intent replies to Sales Agent",
  ],
  neverActions: [
    "No new channels without approval",
    "No price or refund changes",
    "No audience expansion beyond list",
  ],
};
