"use server";

import { revalidatePath } from "next/cache";
import {
  getConsoleService,
  requireConsoleAgent,
} from "@/lib/console";
import type {
  CaseReasonCode,
  CaseOutcome,
  ResolveCaseResult,
} from "@/types/console";

function revalidateCasePaths(caseId: string) {
  revalidatePath("/console", "layout");
  revalidatePath("/console");
  revalidatePath("/console/disputes");
  revalidatePath(`/console/disputes/${caseId}`);
  revalidatePath("/console/ledger");
}

export async function resolveCaseAction(input: {
  caseId: string;
  outcome: CaseOutcome;
  reasonCode: CaseReasonCode;
  note: string;
  idempotencyKey: string;
}): Promise<ResolveCaseResult> {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false, error: "forbidden" };

  const result = await getConsoleService().resolveCase(input, auth.agent);
  if (!result.ok) return result;

  revalidateCasePaths(input.caseId);
  return result;
}

export async function approveCaseAction(
  caseId: string,
  idempotencyKey: string,
): Promise<ResolveCaseResult> {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false, error: "forbidden" };

  const result = await getConsoleService().approveCase(
    caseId,
    auth.agent,
    idempotencyKey,
  );
  if (!result.ok) return result;

  revalidateCasePaths(caseId);
  return result;
}
