"use server";

import { getBuyerService } from "@/lib/buyer";
import type {
  BuyerProblemReason,
  BuyerRating,
  ConfirmReceivedInput,
} from "@/types/buyer";
import { revalidatePath } from "next/cache";

export async function confirmReceivedAction(input: ConfirmReceivedInput) {
  const result = await getBuyerService().confirmReceived(input);
  if (result.ok) revalidatePath(`/order/${input.orderId}`);
  return result;
}

export async function reportBuyerProblemAction(
  orderId: string,
  reason: BuyerProblemReason,
) {
  const result = await getBuyerService().reportProblem({ orderId, reason });
  if (result.ok) revalidatePath(`/order/${orderId}`);
  return result;
}

export async function cancelHeldOrderAction(orderId: string) {
  const result = await getBuyerService().cancelHeldOrder(orderId);
  if (result.ok) revalidatePath(`/order/${orderId}`);
  return result;
}

export async function rateOrderAction(orderId: string, rating: BuyerRating) {
  const result = await getBuyerService().rateOrder(orderId, rating);
  if (result.ok) revalidatePath(`/order/${orderId}`);
  return result;
}

export async function addDisputeDetailAction(orderId: string, detail: string) {
  const result = await getBuyerService().addDisputeDetail(orderId, detail);
  if (result.ok) revalidatePath(`/order/${orderId}`);
  return result;
}

export async function markCourierCollectedAction(orderId: string) {
  const result = await getBuyerService().markCourierCollected(orderId);
  if (result.ok) revalidatePath(`/order/${orderId}`);
  return result;
}
