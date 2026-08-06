"use server";

import { getBuyerService } from "@/lib/buyer";
import type { ReportListingInput } from "@/types/buyer";

export async function reportListingAction(input: ReportListingInput) {
  return getBuyerService().reportListing(input);
}
