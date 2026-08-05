"use server";

import { revalidatePath } from "next/cache";
import { getDashboardService } from "@/lib/dashboard";

export async function reportOrderProblemAction(orderId: string, reason: string) {
  const result = await getDashboardService().reportOrderProblem(orderId, reason);
  if (!result.ok) return result;

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath("/dashboard/money");
  return result;
}
