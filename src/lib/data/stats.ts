export interface Stat {
  value: string;
  label: string;
}

export const landingStats: Stat[] = [
  { value: "15 min", label: "Optimisation cycle" },
  { value: "5", label: "Autonomous agents" },
  { value: "< 60s", label: "Chat-to-checkout" },
  { value: "100%", label: "Decisions explained" },
];

export const africaStats: Stat[] = [
  { value: "🇷🇼", label: "Headquartered in Kigali" },
  { value: "4", label: "Languages at launch" },
  { value: "5+", label: "Payment rails" },
  { value: "af-south-1", label: "Data residency" },
];
