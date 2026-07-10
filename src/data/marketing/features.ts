import type { Feature } from "@/types/marketing";

export const FEATURES: Feature[] = [
  {
    icon: "layers",
    title: "5-Agent Autonomous System",
    description:
      "A Supervisor orchestrates five specialist agents: Campaign Planner, Creative Generator, Real-time Optimizer, Conversational Sales Agent, and Order Handoff. Each has its own model, tools, and logging schema.",
    detail:
      "The Planner researches audiences and splits budgets. The Creative generates ad copy, images, and short video. The Optimizer watches metrics every 15 minutes. The Sales Agent closes in chat. Handoff delivers clean orders.",
  },
  {
    icon: "messageCircle",
    title: "Conversational Sales Agent",
    description:
      "Not a chatbot that routes to humans — a closer. Handles WhatsApp, Instagram DM, Facebook Messenger, and web widget simultaneously.",
    detail:
      "Detects browse/interest/buy/support/spam intent in milliseconds. Qualifies with the minimum questions needed. Generates payment links in-thread. Confirms on webhook. Escalates to humans only when frustration or complexity is detected.",
  },
  {
    icon: "eye",
    title: "100% Explainable AI",
    description:
      "Every budget shift, creative pick, audience change, bid adjustment, and chat reply is logged with an immutable, signed audit trail.",
    detail:
      'Each event captures: inputs considered, reasoning, action taken, result, and a SHA-256 hash chained to the previous event. The "Why?" button on every dashboard metric opens this trail. Your accountant can read it. Regulators can verify it.',
  },
  {
    icon: "shield",
    title: "Three-Tier Budget Control",
    description:
      "Spend caps enforced at Swarm (tenant), Agent (role), and Task (campaign/conversation) levels. Hard limits, not soft suggestions.",
    detail:
      "A spend-velocity circuit breaker trips if per-minute spend exceeds baseline. Any single action above a configurable threshold requires human approval. Default: reject on timeout (fail-closed).",
  },
  {
    icon: "creditCard",
    title: "Africa-First Payments",
    description:
      "Stripe for international cards. Flutterwave, Paystack, MTN MoMo, and Airtel Money for the African market. All first-class, not regional add-ons.",
    detail:
      "Zero-decimal currencies handled correctly (RWF, KES, NGN, XOF). MoMo settlement notes (~24h) surfaced in the order view. Payment links generated in-chat by the Sales Agent.",
  },
  {
    icon: "refreshCw",
    title: "Real-Time Optimisation",
    description:
      "Every 15 minutes, the Optimizer pulls metrics, compares to 7-day rolling baselines, and acts: pause, scale, reallocate, or alert.",
    detail:
      "Uses Claude Haiku 4.5 for speed and cost. Falls back to Groq Llama 3.3 70B if Bedrock is throttled. Anomaly detection auto-pauses on 3 consecutive ticks of >50% deviation.",
  },
  {
    icon: "globe",
    title: "Multi-Channel, Multi-Language",
    description:
      "English, French, Kinyarwanda, Swahili at launch. WhatsApp, Instagram DM, Messenger, web widget, SMS fallback.",
    detail:
      "All channels funnel into a unified conversation thread per lead. The dashboard shows a three-column inbox on desktop, single column on mobile. Slash-commands for human takeover.",
  },
  {
    icon: "lock",
    title: "Compliance Built In",
    description:
      "GDPR, POPIA, Rwanda Law N° 058/2021. Data residency in AWS af-south-1. 72-hour breach notification. Immutable audit logs.",
    detail:
      "Region-aware consent banners. Right-to-erasure within 30 days. Compliance export as signed JSON-LD. Sub-processor register maintained. SOC 2 readiness in scope.",
  },
];
