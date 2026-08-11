"use server";

import { revalidatePath } from "next/cache";
import {
  getConsoleService,
  requireConsoleAgent,
} from "@/lib/console";
import type { UnmaskField } from "@/types/console";

export async function unmaskIdentityAction(
  personId: string,
  field: UnmaskField,
  reason: string,
) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  // Service logs BEFORE reveal.
  const result = await getConsoleService().unmaskIdentity(
    personId,
    field,
    reason,
    auth.agent,
  );

  if (result.ok) {
    revalidatePath("/console/ledger");
    revalidatePath(`/console/people/${personId}`);
  }

  return result;
}
