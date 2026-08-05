"use server";

import { revalidatePath } from "next/cache";
import { getDashboardService } from "@/lib/dashboard";
import type { ShopPlan } from "@/types/dashboard";

const PLANS: ReadonlySet<ShopPlan> = new Set(["free", "plus"]);

export async function switchPlanAction(plan: ShopPlan) {
  if (!PLANS.has(plan)) {
    return { ok: false as const, error: "validation" as const };
  }

  const result = await getDashboardService().switchPlan(plan);
  if (!result.ok) return result;

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/money");
  revalidatePath("/dashboard/money/plans");
  revalidatePath("/dashboard/settings");

  return result;
}
