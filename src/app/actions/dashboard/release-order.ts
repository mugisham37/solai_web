"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getDashboardService } from "@/lib/dashboard";
import type { ReleaseOrderResult } from "@/types/dashboard";

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/**
 * Releases held money after a correct delivery code.
 * Never call this from optimistic UI — wait for the server result.
 */
export async function releaseOrderAction(
  orderId: string,
  code: string,
): Promise<ReleaseOrderResult> {
  const ip = await clientIp();
  const result = await getDashboardService().releaseOrder(orderId, code, { ip });

  if (!result.ok) return result;

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${orderId}`);
  revalidatePath(`/dashboard/orders/${orderId}/deliver`);
  revalidatePath(`/dashboard/orders/${orderId}/paid`);
  revalidatePath("/dashboard/money");

  return result;
}
