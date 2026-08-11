"use server";

import { revalidatePath } from "next/cache";
import {
  getConsoleService,
  requireConsoleAgent,
} from "@/lib/console";
import type { MarketCode } from "@/types/console";
import type { Money } from "@/types/money";

export async function updateMarketRulesAction(
  market: MarketCode,
  patch: {
    confirmationWindowHours?: number;
    deliverySlaDays?: number;
    newSellerReservePercent?: number;
    disputeAnswerHours?: number;
    approvalThresholdMinor?: number;
    newSellerOrderCap?: Money;
  },
) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().updateMarketRules(
    market,
    {
      confirmationWindowHours: patch.confirmationWindowHours,
      deliverySlaDays: patch.deliverySlaDays,
      newSellerReservePercent: patch.newSellerReservePercent,
      disputeAnswerHours: patch.disputeAnswerHours,
      approvalThresholdMinor: patch.approvalThresholdMinor,
      newSellerOrderCap: patch.newSellerOrderCap,
    },
    auth.agent,
  );

  if (result.ok) {
    revalidatePath("/console/rules");
    revalidatePath("/console/ledger");
    revalidatePath("/console/disputes");
  }
  return result;
}
