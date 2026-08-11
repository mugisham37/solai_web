"use server";

import { revalidatePath } from "next/cache";
import {
  getConsoleService,
  requireConsoleAgent,
} from "@/lib/console";
import type { ListingTakedownReason } from "@/types/console";

function revalidateListings(listingId?: string) {
  revalidatePath("/console", "layout");
  revalidatePath("/console");
  revalidatePath("/console/listings");
  revalidatePath("/console/ledger");
  if (listingId) {
    /* listing detail is inline on the queue */
  }
}

export async function takedownListingAction(
  listingId: string,
  reason: ListingTakedownReason,
) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().takedownListing(
    listingId,
    reason,
    auth.agent,
  );
  if (result.ok) revalidateListings(listingId);
  return result;
}

export async function keepListingAction(listingId: string) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().keepListing(listingId, auth.agent);
  if (result.ok) revalidateListings(listingId);
  return result;
}

export async function restoreListingAction(listingId: string) {
  const auth = await requireConsoleAgent();
  if (!auth.ok) return { ok: false as const, error: "forbidden" as const };

  const result = await getConsoleService().restoreListing(
    listingId,
    auth.agent,
  );
  if (result.ok) revalidateListings(listingId);
  return result;
}
