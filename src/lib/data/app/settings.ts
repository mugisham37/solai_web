import type {
  AgentPermissionProfile,
  AuditEvent,
  Integration,
  Invoice,
  SpendEnvelope,
  TeamMember,
  UsageMetric,
} from "@/types/app";

export const teamMembers: TeamMember[] = [
  {
    name: "Claudine Niyongabo",
    email: "claudine@inema-boutique.rw",
    role: "Owner",
    scope: "Everything",
    status: "active",
    mfa: true,
    last: "2 min ago",
  },
  {
    name: "Eric Habimana",
    email: "eric@inema-boutique.rw",
    role: "Admin",
    scope: "All except Billing",
    status: "active",
    mfa: true,
    last: "14 min ago",
  },
  {
    name: "Aline Uwase",
    email: "aline@inema-boutique.rw",
    role: "Operator",
    scope: "Campaigns + Conversations",
    status: "active",
    mfa: true,
    last: "1h ago",
  },
  {
    name: "Jean-Pierre N.",
    email: "jp@inema-boutique.rw",
    role: "Viewer",
    scope: "Read-only",
    status: "active",
    mfa: false,
    last: "3h ago",
  },
  {
    name: "Marie Claire K.",
    email: "marie@inema-boutique.rw",
    role: "Operator",
    scope: "Conversations only",
    status: "invited",
    mfa: false,
    last: "—",
  },
];

export const roleDefinitions = [
  {
    role: "Owner",
    desc: "Full access. Can change billing, permissions, and delete workspace.",
  },
  {
    role: "Admin",
    desc: "Manage team, campaigns, and integrations. Cannot change billing.",
  },
  {
    role: "Operator",
    desc: "Run campaigns and handle conversations. Cannot change agent permissions.",
  },
  {
    role: "Viewer",
    desc: "Read-only access to dashboards, reports, and audit log.",
  },
];

export const agentPermissions: AgentPermissionProfile[] = [
  {
    id: "sales",
    name: "Sales Agent",
    color: "#5B7CFF",
    groups: [
      {
        title: "Conversations",
        rows: [
          {
            key: "reply_dms",
            label: "Reply to DMs",
            description: "Respond to inbound messages on connected channels",
            value: "auto",
          },
          {
            key: "send_outbound",
            label: "Send outbound messages",
            description: "Proactive messages to individual contacts",
            value: "approve",
          },
          {
            key: "send_outbound_bulk",
            label: "Bulk outbound",
            description: "Broadcast to audience segments",
            value: "limit",
            envelope: "500 contacts/day",
          },
        ],
      },
      {
        title: "Commerce",
        rows: [
          {
            key: "confirm_orders",
            label: "Confirm orders",
            description: "Accept and confirm customer orders",
            value: "auto",
          },
          {
            key: "issue_refund",
            label: "Issue refunds",
            description: "Process refund requests",
            value: "approve",
          },
          {
            key: "discount_code",
            label: "Create discount codes",
            description: "Generate promotional codes",
            value: "limit",
            envelope: "10% max · RWF 5,000/day",
          },
        ],
      },
    ],
  },
  {
    id: "support",
    name: "Support Agent",
    color: "#34D399",
    groups: [
      {
        title: "Conversations",
        rows: [
          {
            key: "reply_dms",
            label: "Reply to DMs",
            description: "Respond to support inquiries",
            value: "auto",
          },
        ],
      },
      {
        title: "Commerce",
        rows: [
          {
            key: "issue_refund",
            label: "Issue refunds",
            description: "Process refund requests",
            value: "approve",
          },
        ],
      },
    ],
  },
  {
    id: "creative",
    name: "Creative Agent",
    color: "#FFB547",
    groups: [
      {
        title: "Campaigns & creative",
        rows: [
          {
            key: "edit_creative",
            label: "Edit creative",
            description: "Modify ad copy and visuals",
            value: "auto",
          },
          {
            key: "publish_creative",
            label: "Publish creative",
            description: "Push new creatives live",
            value: "approve",
          },
        ],
      },
    ],
  },
  {
    id: "analyst",
    name: "Analyst Agent",
    color: "#7AA7FF",
    groups: [
      {
        title: "Operations",
        rows: [
          {
            key: "spend_ads",
            label: "Adjust ad spend",
            description: "Reallocate budget across channels",
            value: "limit",
            envelope: "US$ 500/day",
          },
          {
            key: "pause_campaign",
            label: "Pause campaigns",
            description: "Pause underperforming campaigns",
            value: "auto",
          },
        ],
      },
    ],
  },
  {
    id: "safety",
    name: "Safety Agent",
    color: "#F97066",
    groups: [
      {
        title: "Operations",
        rows: [
          {
            key: "contact_supplier",
            label: "Contact supplier",
            description: "Reach out to suppliers for inventory",
            value: "never",
          },
        ],
      },
    ],
  },
];

export const integrations: Integration[] = [
  {
    id: "whatsapp",
    category: "Channels",
    name: "WhatsApp Business",
    accountId: "+250 788 102 884",
    icon: "MessageCircle",
    color: "#25D366",
    status: "connected",
    extra: "Catalog synced · 4,210 contacts",
  },
  {
    id: "instagram",
    category: "Channels",
    name: "Instagram",
    accountId: "@inema_boutique",
    icon: "Instagram",
    color: "#E1306C",
    status: "connected",
  },
  {
    id: "meta",
    category: "Channels",
    name: "Meta Ads",
    accountId: "act_48291047",
    icon: "Facebook",
    color: "#1877F2",
    status: "connected",
    extra: "US$ 6,250 spent this month",
  },
  {
    id: "google",
    category: "Channels",
    name: "Google Ads",
    accountId: "482-910-2847",
    icon: "Globe",
    color: "#4285F4",
    status: "connected",
  },
  {
    id: "tiktok",
    category: "Channels",
    name: "TikTok Ads",
    accountId: "—",
    icon: "Video",
    color: "#FE2C55",
    status: "available",
  },
  {
    id: "momo",
    category: "Payments",
    name: "MTN MoMo",
    accountId: "788 102 884",
    icon: "Smartphone",
    color: "#FFCC00",
    status: "connected",
  },
  {
    id: "airtel",
    category: "Payments",
    name: "Airtel Money",
    accountId: "073 882 119",
    icon: "Smartphone",
    color: "#ED1C24",
    status: "connected",
  },
  {
    id: "stripe",
    category: "Payments",
    name: "Stripe",
    accountId: "acct_1Nx…4k2m",
    icon: "CreditCard",
    color: "#635BFF",
    status: "connected",
    extra: "Cards + diaspora payments",
  },
  {
    id: "wave",
    category: "Payments",
    name: "Wave / Sendwave",
    accountId: "—",
    icon: "Send",
    color: "#1DC8E9",
    status: "available",
  },
  {
    id: "shopify",
    category: "Inventory & shipping",
    name: "Shopify",
    accountId: "inema-boutique.myshopify.com",
    icon: "ShoppingBag",
    color: "#96BF48",
    status: "connected",
    extra: "47 products synced",
  },
  {
    id: "dhl",
    category: "Inventory & shipping",
    name: "DHL Express",
    accountId: "RW-482910",
    icon: "Truck",
    color: "#D40511",
    status: "connected",
  },
  {
    id: "ga4",
    category: "Data & analytics",
    name: "Google Analytics 4",
    accountId: "G-4X82M9K1P",
    icon: "BarChart3",
    color: "#F4B400",
    status: "connected",
  },
];

export const usageMetrics: UsageMetric[] = [
  { label: "Agent runs", used: 2840, max: 5000, unit: "runs" },
  { label: "Conversations", used: 1240, max: 2000, unit: "threads" },
  { label: "Outbound messages", used: 4200, max: 5000, unit: "msgs" },
  { label: "Storage", used: 2.4, max: 5, unit: "GB" },
];

export const spendEnvelopes: SpendEnvelope[] = [
  { label: "Ads (weekly)", used: 4250, max: 5000, currency: "US$" },
  { label: "Discounts (daily)", used: 3200, max: 5000, currency: "RWF" },
  { label: "Refunds (monthly)", used: 45000, max: 100000, currency: "RWF" },
  { label: "Outbound bulk", used: 1840, max: 2500, currency: "contacts" },
];

export const invoices: Invoice[] = [
  {
    period: "Jul 2026",
    plan: "Growth",
    amount: "US$ 89.00",
    status: "pending",
  },
  {
    period: "Jun 2026",
    plan: "Growth",
    amount: "US$ 89.00",
    status: "paid",
  },
  {
    period: "May 2026",
    plan: "Growth",
    amount: "US$ 89.00",
    status: "paid",
  },
  {
    period: "Apr 2026",
    plan: "Starter",
    amount: "US$ 29.00",
    status: "paid",
  },
];

export const auditEvents: AuditEvent[] = [
  {
    id: "ae1",
    time: "06:42",
    day: "Today",
    who: "Real-time Optimizer",
    actor: "agent",
    action: "Increased Instagram Reels budget by 15%",
    meta: "Campaign c1 · run_7f3a…e91c",
    tone: "success",
  },
  {
    id: "ae2",
    time: "06:24",
    day: "Today",
    who: "Sales Agent",
    actor: "agent",
    action: "Closed sale via WhatsApp · RWF 24,500",
    meta: "Buyer: Kalisa Mugisha · MoMo",
    tone: "success",
  },
  {
    id: "ae3",
    time: "06:08",
    day: "Today",
    who: "Real-time Optimizer",
    actor: "agent",
    action: 'Paused ad set "broad-keywords-2"',
    meta: "CTR 0.4% · run_8b2c…d41f",
    tone: "warning",
  },
  {
    id: "ae4",
    time: "05:34",
    day: "Today",
    who: "Safety Agent",
    actor: "safety",
    action: "Quarantined inbound DM",
    meta: "Prompt injection · score 0.94",
    tone: "danger",
  },
  {
    id: "ae5",
    time: "04:12",
    day: "Today",
    who: "Claudine Niyongabo",
    actor: "human",
    action: "Approved creative publish",
    meta: "3 Reels variants · c1",
    tone: "info",
  },
  {
    id: "ae6",
    time: "18:47",
    day: "Yesterday",
    who: "Campaign Planner",
    actor: "agent",
    action: "Drafted WhatsApp re-engagement campaign",
    meta: "Campaign c5 · 1,840 contacts",
    tone: "info",
  },
  {
    id: "ae7",
    time: "14:22",
    day: "Yesterday",
    who: "Eric Habimana",
    actor: "human",
    action: "Changed Sales Agent permission: bulk outbound → limit",
    meta: "500 contacts/day envelope",
    tone: "warning",
  },
  {
    id: "ae8",
    time: "11:05",
    day: "Yesterday",
    who: "Real-time Optimizer",
    actor: "agent",
    action: "Reallocated US$ 45 from Google Display to Meta Reels",
    meta: "run_9c3d…e52g",
    tone: "success",
  },
  {
    id: "ae9",
    time: "09:30",
    day: "Yesterday",
    who: "Creative Generator",
    actor: "agent",
    action: "Generated 3 Reels variants",
    meta: "Ankara Print Tee — Indigo",
    tone: "info",
  },
];

export const settingsNav = [
  {
    group: "Personal",
    items: [
      { id: "profile", href: "/settings/profile", label: "Profile", icon: "User" },
    ],
  },
  {
    group: "Workspace",
    items: [
      { id: "team", href: "/settings/team", label: "Team & roles", icon: "Users" },
      {
        id: "permissions",
        href: "/settings/permissions",
        label: "Agent permissions",
        icon: "Shield",
      },
      {
        id: "integrations",
        href: "/settings/integrations",
        label: "Integrations",
        icon: "Plug",
      },
      {
        id: "billing",
        href: "/settings/billing",
        label: "Billing & usage",
        icon: "CreditCard",
      },
      { id: "audit", href: "/settings/audit", label: "Audit log", icon: "FileText" },
    ],
  },
];
