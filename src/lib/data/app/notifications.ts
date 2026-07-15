import type { Notification } from "@/types/app";

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "success",
    agent: "Optimizer",
    msg: "Increased Instagram Reels budget by 15% — CPA tracking 18% under target.",
    time: "2m ago",
  },
  {
    id: "n2",
    type: "success",
    agent: "Sales Agent",
    msg: "Closed sale via WhatsApp · MTN MoMo · RWF 24,500.",
    time: "18m ago",
  },
  {
    id: "n3",
    type: "warning",
    agent: "Optimizer",
    msg: 'Paused Google Search ad set "broad-keywords-2" — CTR fell to 0.4%.',
    time: "34m ago",
  },
  {
    id: "n4",
    type: "info",
    agent: "Creative",
    msg: 'Generated 3 new creative variants for "Ankara Print Tee — Indigo".',
    time: "1h ago",
  },
  {
    id: "n5",
    type: "danger",
    agent: "Safety",
    msg: "Quarantined inbound DM as suspected prompt-injection.",
    time: "2h ago",
  },
  {
    id: "n6",
    type: "info",
    agent: "Planner",
    msg: 'Campaign "Cape Threads Linen" moved from Learning to Live.',
    time: "3h ago",
  },
];
