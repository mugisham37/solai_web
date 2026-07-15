export type EventTone = "success" | "warning" | "danger" | "info";
export type AgentHealth = "running" | "idle" | "paused" | "errored";
export type CampaignState = "live" | "learning" | "paused" | "draft";
export type Channel = "meta" | "google" | "whatsapp" | "instagram";
export type ConversationStatus =
  | "agent-handling"
  | "needs-human"
  | "closed"
  | "quarantine";
export type PermissionValue = "auto" | "approve" | "never" | "limit";
export type CreativeStatus = "winning" | "live" | "paused";
export type AbTestState = "running" | "completed" | "queued";
export type AudienceStatus = "scaling" | "steady" | "learning";
export type IntegrationStatus = "connected" | "available";
export type TeamRole = "Owner" | "Admin" | "Operator" | "Viewer";
export type AuditActor = "agent" | "human" | "safety";

export interface WhyDecision {
  headline: string;
  bullets: string[];
  agent: string;
  runId: string;
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  up: boolean;
  sub: string;
  spark: number[];
  why: WhyDecision;
}

export interface PerformanceDataPoint {
  date: string;
  revenue: number;
  spend: number;
  roas: number;
}

export interface TimelineEvent {
  id: string;
  time: string;
  agent: string;
  msg: string;
  type: EventTone;
  why?: WhyDecision;
}

export interface AttentionItem {
  id: string;
  icon: string;
  color: string;
  title: string;
  desc: string;
  action: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  icon: string;
  task: string;
  runtime: string;
  health: AgentHealth;
  color: string;
  why?: WhyDecision;
}

export interface CopilotMessage {
  role: "user" | "ai";
  text: string;
  agent?: string;
  runId?: string;
}

export interface Notification {
  id: string;
  type: EventTone;
  agent: string;
  msg: string;
  time: string;
}

export interface Campaign {
  id: string;
  name: string;
  state: CampaignState;
  stage: string;
  channels: Channel[];
  spend: number;
  cap: number;
  roas: number | null;
  orders: number;
  cpa: number | null;
  lastEdit: string;
}

export interface ChannelAllocation {
  channel: string;
  pct: number;
  spend: number;
  roas: number;
  color: string;
}

export interface Audience {
  name: string;
  size: string;
  cpa: number;
  status: AudienceStatus;
}

export interface AgentAction {
  time: string;
  agent: string;
  action: string;
  why?: WhyDecision;
}

export interface Creative {
  id: string;
  channel: Channel;
  format: "reel" | "square" | "wide";
  copy: string;
  ctr: number;
  cpa: number;
  impr: number;
  status: CreativeStatus;
}

export interface AbTest {
  id: string;
  name: string;
  state: AbTestState;
  variant: string;
  winner: string | null;
  metric: string;
  a: { name: string; val: string; sample: number };
  b: { name: string; val: string; sample: number };
  lift: string;
  confidence: number;
}

export interface Conversation {
  id: string;
  name: string;
  channel: Channel;
  preview: string;
  time: string;
  unread: boolean;
  agent: "sales" | "support" | null;
  tags: string[];
  status: ConversationStatus;
  phone?: string;
  location?: string;
}

export interface ThreadMessage {
  id: string;
  who: "them" | "agent";
  t: string;
  msg: string;
  agent?: string;
  whyId?: string;
  why?: WhyDecision;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: Channel;
  uses: number;
  reply: number;
  body: string;
}

export interface QuarantineItem {
  id: string;
  from: string;
  time: string;
  channel: Channel;
  reason: string;
  score: number;
  preview: string;
  raw: string;
}

export interface TeamMember {
  name: string;
  email: string;
  role: TeamRole;
  scope: string;
  status: "active" | "invited";
  mfa: boolean;
  last: string;
}

export interface PermissionRow {
  key: string;
  label: string;
  description: string;
  value: PermissionValue;
  envelope?: string;
}

export interface PermissionGroup {
  title: string;
  rows: PermissionRow[];
}

export interface AgentPermissionProfile {
  id: string;
  name: string;
  color: string;
  groups: PermissionGroup[];
}

export interface Integration {
  id: string;
  category: string;
  name: string;
  accountId: string;
  icon: string;
  color: string;
  status: IntegrationStatus;
  extra?: string;
}

export interface UsageMetric {
  label: string;
  used: number;
  max: number;
  unit: string;
}

export interface SpendEnvelope {
  label: string;
  used: number;
  max: number;
  currency: string;
}

export interface Invoice {
  period: string;
  plan: string;
  amount: string;
  status: "paid" | "pending";
}

export interface AuditEvent {
  id: string;
  time: string;
  day: string;
  who: string;
  actor: AuditActor;
  action: string;
  meta: string;
  tone: EventTone;
}

export interface WorkspaceInfo {
  name: string;
  plan: string;
  members: number;
  region: string;
  initials: string;
}

export interface AppNavItem {
  id: string;
  href: string;
  label: string;
  icon: string;
}
