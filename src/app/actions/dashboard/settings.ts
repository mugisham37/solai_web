"use server";

import { revalidatePath } from "next/cache";
import { getDashboardService } from "@/lib/dashboard";
import { sanitiseSlug } from "@/lib/slug";
import type { SaveShopSettingsInput } from "@/types/dashboard";

export async function saveShopSettingsAction(input: SaveShopSettingsInput) {
  const name = input.name.trim();
  const slug = sanitiseSlug(input.slug);
  const city = input.city.trim();

  if (!name || !slug || !city) {
    return { ok: false as const, error: "validation" as const };
  }

  const result = await getDashboardService().saveShopSettings({
    ...input,
    name,
    slug,
    city,
  });

  if (!result.ok) return result;

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/money");
  revalidatePath("/dashboard/grow");

  return result;
}
