"use server";

import { revalidatePath } from "next/cache";
import { getDashboardService } from "@/lib/dashboard";

export async function startBoostAction(input: {
  productId: string;
  budgetMinor: number;
}) {
  const result = await getDashboardService().startBoost(input);
  if (!result.ok) return result;

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/grow");
  revalidatePath("/dashboard/grow/boost");
  revalidatePath("/dashboard/money");
  return result;
}
