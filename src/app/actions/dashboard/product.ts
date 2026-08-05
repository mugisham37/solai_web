"use server";

import { revalidatePath } from "next/cache";
import { getDashboardService } from "@/lib/dashboard";
import { productEditSchema } from "@/lib/schemas/product-edit";
import type { SaveProductInput } from "@/types/dashboard";

function revalidateProductPaths(productId?: string) {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/grow");
  if (productId) {
    revalidatePath(`/dashboard/products/${productId}`);
  }
}

export async function saveProductAction(input: SaveProductInput) {
  const parsed = productEditSchema.safeParse({
    title: input.name,
    priceMinor: input.priceMinor,
    stock: input.stock,
    descriptionEn: input.description,
    onSale: input.onSale,
  });

  if (!parsed.success) {
    return { ok: false as const, error: "validation" as const };
  }

  const result = await getDashboardService().saveProduct({
    id: input.id,
    name: parsed.data.title,
    priceMinor: parsed.data.priceMinor,
    stock: parsed.data.stock,
    description: parsed.data.descriptionEn,
    onSale: parsed.data.onSale,
  });

  if (!result.ok) return result;

  revalidateProductPaths(input.id);
  return result;
}

export async function deleteProductAction(productId: string) {
  const result = await getDashboardService().deleteProduct(productId);
  if (!result.ok) return result;

  revalidateProductPaths(productId);
  return result;
}
