import type { ProofStatContent } from "@/types/landing";

export const proofStats: readonly ProofStatContent[] = [
  {
    id: "proof-payout",
    type: "money",
    count: 184,
    suffix: "M",
    money: { amountMinor: 184_000_000, currency: "RWF" },
    labelKey: "proof.stats.payout",
  },
  {
    id: "proof-shops",
    type: "number",
    count: 12400,
    suffix: "+",
    labelKey: "proof.stats.shops",
  },
  {
    id: "proof-time",
    type: "time",
    count: 2,
    secondCount: 14,
    labelKey: "proof.stats.time",
  },
  {
    id: "proof-disputes",
    type: "percent",
    count: 99,
    suffix: ".4%",
    labelKey: "proof.stats.disputes",
  },
] as const;

export const proofCitiesKey = "proof.cities" as const;
