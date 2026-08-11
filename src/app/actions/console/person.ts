"use server";

import { revalidatePath } from "next/cache";
import {
  getConsoleService,
  requireConsoleAgent,
} from "@/lib/console";
import type { GraduatedControls } from "@/types/console";

function revalidatePerson(personId: string) {
  revalidatePath("/console", "layout");
  revalidatePath("/console");
  revalidatePath("/console/people");
  revalidatePath(`/console/people/${personId}`);
  revalidatePath("/console/ledger");
}

export async function setGraduatedControlAction(
  personId: string,
  key: keyof GraduatedControls,
  value: boolean,
) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().setGraduatedControl(
    personId,
    key,
    value,
    auth.agent,
  );
  if (result.ok) revalidatePerson(personId);
  return result;
}

export async function setWatchFlagAction(personId: string, flag: string) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().setWatchFlag(
    personId,
    flag,
    auth.agent,
  );
  if (result.ok) revalidatePerson(personId);
  return result;
}

export async function suspendAccountAction(personId: string) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().suspendAccount(
    personId,
    auth.agent,
  );
  if (result.ok) revalidatePerson(personId);
  return result;
}

export async function reinstateAccountAction(personId: string) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().reinstateAccount(
    personId,
    auth.agent,
  );
  if (result.ok) revalidatePerson(personId);
  return result;
}
