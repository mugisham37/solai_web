"use server";

import { getBuyerService } from "@/lib/buyer";
import type { NotifyRestockInput } from "@/types/buyer";

export async function notifyRestockAction(input: NotifyRestockInput) {
  return getBuyerService().notifyRestock(input);
}
