import type {
  AgentStatus,
  AttentionItem,
  CopilotMessage,
  Kpi,
  PerformanceDataPoint,
  TimelineEvent,
} from "@/types/app";

const defaultWhy = {
  headline:
    "SolAI optimised budget allocation based on 7-day rolling performance.",
  bullets: [
    "Reels CTR 3.2% — 1.8× above Feed average",
    "CPA tracking 18% under target",
    "Budget shifted from underperformers automatically",
  ],
  agent: "Real-time Optimizer",
  runId: "run_7f3a…e91c",
};

export const dashboardKpis: Kpi[] = [
  {
    id: "spend",
    label: "Total Spend",
    value: "US$ 4,231",
    delta: "+12.3%",
    up: true,
    sub: "of US$ 10,000 cap",
    spark: [28, 24, 26, 20, 18, 14, 10, 12, 6],
    why: defaultWhy,
  },
  {
    id: "revenue",
    label: "Revenue (ROAS)",
    value: "US$ 18,420",
    delta: "3.2x",
    up: true,
    sub: "7-day attributed",
    spark: [20, 18, 16, 14, 10, 8, 6, 8, 4],
    why: {
      headline: "Revenue attributed via 7-day click-through window.",
      bullets: [
        "Meta Reels driving 62% of attributed revenue",
        "WhatsApp catalog conversions up 24% week-over-week",
        "ROAS above 3.0x target for 5 consecutive days",
      ],
      agent: "Real-time Optimizer",
      runId: "run_4a2b…c81d",
    },
  },
  {
    id: "cpa",
    label: "CPA",
    value: "US$ 8.45",
    delta: "-6.2%",
    up: true,
    sub: "Target: US$ 12.00",
    spark: [18, 16, 14, 12, 14, 10, 8, 10, 8],
    why: {
      headline: "CPA reduced by pausing underperforming ad sets.",
      bullets: [
        "Google Search broad-keywords-2 paused at 0.4% CTR",
        "Budget reallocated to Instagram Reels",
        "Lookalike audience delivering US$ 6.20 CPA",
      ],
      agent: "Real-time Optimizer",
      runId: "run_8b2c…d41f",
    },
  },
  {
    id: "conversations",
    label: "Active Conversations",
    value: "47",
    delta: "+8",
    up: true,
    sub: "12 closing now",
    spark: [22, 20, 18, 16, 14, 16, 12, 10, 8],
    why: defaultWhy,
  },
  {
    id: "orders",
    label: "Closed Orders",
    value: "214",
    delta: "+31 today",
    up: true,
    sub: "RWF 1.2M total",
    spark: [26, 22, 20, 18, 14, 12, 10, 8, 6],
    why: defaultWhy,
  },
  {
    id: "ctr",
    label: "CTR",
    value: "2.8%",
    delta: "-0.3%",
    up: false,
    sub: "Below 3% baseline",
    spark: [8, 10, 6, 12, 16, 14, 20, 22, 26],
    why: {
      headline: "CTR dipped due to Google Display fatigue.",
      bullets: [
        "Display creative running 14 days without refresh",
        "Creative Agent queued 3 new variants",
        "Reels CTR holding at 3.2% — above baseline",
      ],
      agent: "Creative Generator",
      runId: "run_2d8e…f33a",
    },
  },
];

export const performanceData: Record<"7d" | "30d" | "90d", PerformanceDataPoint[]> = {
  "7d": [
    { date: "Jul 9", revenue: 2100, spend: 580, roas: 3.6 },
    { date: "Jul 10", revenue: 2450, spend: 620, roas: 3.9 },
    { date: "Jul 11", revenue: 2680, spend: 590, roas: 4.5 },
    { date: "Jul 12", revenue: 2890, spend: 610, roas: 4.7 },
    { date: "Jul 13", revenue: 2650, spend: 640, roas: 4.1 },
    { date: "Jul 14", revenue: 3120, spend: 680, roas: 4.6 },
    { date: "Jul 15", revenue: 3530, spend: 711, roas: 5.0 },
  ],
  "30d": [
    { date: "Jun 16", revenue: 8200, spend: 2800, roas: 2.9 },
    { date: "Jun 23", revenue: 9400, spend: 2950, roas: 3.2 },
    { date: "Jun 30", revenue: 11200, spend: 3100, roas: 3.6 },
    { date: "Jul 7", revenue: 14800, spend: 3600, roas: 4.1 },
    { date: "Jul 15", revenue: 18420, spend: 4231, roas: 4.4 },
  ],
  "90d": [
    { date: "Apr", revenue: 28000, spend: 12000, roas: 2.3 },
    { date: "May", revenue: 42000, spend: 14500, roas: 2.9 },
    { date: "Jun", revenue: 58000, spend: 16800, roas: 3.5 },
    { date: "Jul", revenue: 18420, spend: 4231, roas: 4.4 },
  ],
};

export const timelineEvents: TimelineEvent[] = [
  {
    id: "t1",
    time: "2 min ago",
    agent: "Optimizer",
    msg: "Increased Instagram Reels budget by 15% — CPA tracking 18% under target.",
    type: "success",
    why: defaultWhy,
  },
  {
    id: "t2",
    time: "18 min ago",
    agent: "Sales Agent",
    msg: "Closed sale via WhatsApp · MTN MoMo · RWF 24,500. Buyer: Kalisa Mugisha.",
    type: "success",
  },
  {
    id: "t3",
    time: "34 min ago",
    agent: "Optimizer",
    msg: 'Paused Google Search ad set "broad-keywords-2" — CTR fell to 0.4%.',
    type: "warning",
    why: {
      headline: "Ad set paused to protect budget efficiency.",
      bullets: [
        "CTR 0.4% over last 3 ticks (45 min)",
        "CPA spiked to US$ 22.80 — nearly 2× target",
        "Budget will be reallocated to Reels",
      ],
      agent: "Real-time Optimizer",
      runId: "run_8b2c…d41f",
    },
  },
  {
    id: "t4",
    time: "1h ago",
    agent: "Creative",
    msg: 'Generated 3 new Reels variants for "Ankara Print Tee — Indigo".',
    type: "info",
  },
  {
    id: "t5",
    time: "2h ago",
    agent: "Safety",
    msg: "Quarantined inbound DM as suspected prompt-injection. Blocked and logged.",
    type: "danger",
  },
  {
    id: "t6",
    time: "3h ago",
    agent: "Planner",
    msg: 'Campaign "Cape Threads Linen Shirt" moved from Learning to Live.',
    type: "success",
  },
  {
    id: "t7",
    time: "4h ago",
    agent: "Sales Agent",
    msg: "Generated payment link for Amara Diallo — Stripe · US$ 89.00.",
    type: "info",
  },
  {
    id: "t8",
    time: "5h ago",
    agent: "Optimizer",
    msg: "Reallocated US$ 45 from Google Display to Meta Reels (higher CTR).",
    type: "success",
  },
];

export const attentionItems: AttentionItem[] = [
  {
    id: "a1",
    icon: "AlertTriangle",
    color: "var(--warning)",
    title: "Budget approaching cap",
    desc: "US$ 8,500 of US$ 10,000 spent. 2 days remaining at current pace.",
    action: "Increase cap",
  },
  {
    id: "a2",
    icon: "Shield",
    color: "var(--danger)",
    title: "Anomaly detected",
    desc: 'Spend velocity 2.3× baseline on "Ankara Tee" Google Search.',
    action: "Review",
  },
  {
    id: "a3",
    icon: "Eye",
    color: "var(--info)",
    title: "Pending approval",
    desc: "Creative Agent wants to test TikTok-style vertical video. Requires opt-in.",
    action: "Approve",
  },
  {
    id: "a4",
    icon: "MessageCircle",
    color: "var(--brand)",
    title: "Handoff requested",
    desc: "Customer Amara Diallo asking about bulk pricing — beyond Sales Agent scope.",
    action: "Take over",
  },
];

export const agentStatuses: AgentStatus[] = [
  {
    id: "planner",
    name: "Campaign Planner",
    icon: "BarChart3",
    task: 'Researching Meta audiences for "Ankara Print Tee"',
    runtime: "4m 12s",
    health: "running",
    color: "var(--brand)",
    why: defaultWhy,
  },
  {
    id: "creative",
    name: "Creative Generator",
    icon: "Palette",
    task: "Generating 3 Reels variants",
    runtime: "1m 45s",
    health: "running",
    color: "var(--info)",
  },
  {
    id: "optimizer",
    name: "Real-time Optimizer",
    icon: "TrendingUp",
    task: "Idle — next tick in 11 min",
    runtime: "—",
    health: "idle",
    color: "var(--success)",
  },
  {
    id: "sales",
    name: "Sales Agent",
    icon: "MessageSquare",
    task: "Qualifying lead: Kalisa Mugisha (WhatsApp)",
    runtime: "32s",
    health: "running",
    color: "var(--warning)",
  },
  {
    id: "handoff",
    name: "Order Handoff",
    icon: "Package",
    task: "Paused — no pending orders",
    runtime: "—",
    health: "paused",
    color: "var(--text-subtle)",
  },
];

export const copilotMessages: CopilotMessage[] = [
  { role: "user", text: "Why did you pause the Google Search ad set?" },
  {
    role: "ai",
    text: 'The "broad-keywords-2" ad set had a CTR of 0.4% over the last 3 ticks (45 minutes) — well below the 1.5% baseline. CPA spiked to US$ 22.80, nearly 2× your target of US$ 12.00. I paused it to protect budget.',
    agent: "Real-time Optimizer",
    runId: "run_8b2c…d41f",
  },
  { role: "user", text: "What would happen if I resumed it?" },
  {
    role: "ai",
    text: "Based on current trends, resuming would likely spend ~US$ 120 over the next 3 hours with a projected CPA of US$ 19-24. I'd recommend instead reallocating that budget to Instagram Reels, which is delivering a 3.2% CTR and US$ 6.20 CPA.",
    agent: "Real-time Optimizer",
    runId: "run_8b2c…d41f",
  },
  { role: "user", text: "Do it. Move the budget to Reels." },
  {
    role: "ai",
    text: "Done. Reallocated US$ 85 from Google Search to Instagram Reels. The Optimizer will track the change over the next 3 ticks and report back.",
    agent: "Real-time Optimizer",
    runId: "run_9c3d…e52g",
  },
];
