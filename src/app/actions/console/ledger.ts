"use server";

import { revalidatePath } from "next/cache";
import {
  getConsoleService,
  requireConsoleAgent,
} from "@/lib/console";

function revalidateLedger() {
  revalidatePath("/console", "layout");
  revalidatePath("/console");
  revalidatePath("/console/ledger");
}

export async function retryDisbursementAction(payoutId: string) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().retryDisbursement(
    payoutId,
    auth.agent,
  );
  if (result.ok) revalidateLedger();
  return result;
}

export async function retryAllDisbursementsAction() {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().retryAllDisbursements(auth.agent);
  if (result.ok) revalidateLedger();
  return result;
}

export async function runReconciliationAction() {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().runReconciliation(auth.agent);
  if (result.ok) revalidateLedger();
  return result;
}

export async function exportDisputesCsvAction(filter?: string, q?: string) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const csv = await getConsoleService().exportDisputesCsv({
    filter:
      filter === "waiting" ||
      filter === "escalated" ||
      filter === "closed" ||
      filter === "awaiting_approval" ||
      filter === "all"
        ? filter
        : "open",
    q,
  });
  return { ok: true as const, csv };
}
