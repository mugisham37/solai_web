"use server";

import { getBuyerService } from "@/lib/buyer";
import type { CreateCheckoutSessionInput } from "@/types/buyer";

export async function createCheckoutSessionAction(input: CreateCheckoutSessionInput) {
  return getBuyerService().createCheckoutSession(input);
}
