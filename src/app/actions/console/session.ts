"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  agentForRole,
  clearConsoleSession,
  setConsoleSession,
} from "@/lib/console";
import type { ConsoleRole } from "@/types/console";

export async function loginConsoleAction(role: ConsoleRole) {
  const agent = agentForRole(role);
  await setConsoleSession(agent);
  revalidatePath("/console", "layout");
  redirect("/console");
}

export async function switchConsoleRoleAction(role: ConsoleRole) {
  const agent = agentForRole(role);
  await setConsoleSession(agent);
  revalidatePath("/console", "layout");
}

export async function logoutConsoleAction() {
  await clearConsoleSession();
  revalidatePath("/console", "layout");
  redirect("/console/login");
}
