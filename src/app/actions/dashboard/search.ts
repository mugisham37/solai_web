"use server";

import { getDashboardService } from "@/lib/dashboard";

export async function searchDashboardAction(query: string) {
  return getDashboardService().search(query);
}
