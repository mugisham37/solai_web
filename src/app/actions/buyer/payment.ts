"use server";

import { getBuyerService } from "@/lib/buyer";
import type { PlaceBuyerOrderInput } from "@/types/buyer";

export async function startMomoPaymentAction(input: PlaceBuyerOrderInput) {
  return getBuyerService().startMomoPayment(input);
}

export async function cancelMomoPaymentAction(sessionId: string) {
  return getBuyerService().cancelMomoPayment(sessionId);
}

export async function confirmPaymentAction(input: PlaceBuyerOrderInput) {
  return getBuyerService().confirmPayment(input);
}

export async function placeCodOrderAction(input: PlaceBuyerOrderInput) {
  return getBuyerService().placeCodOrder(input);
}
