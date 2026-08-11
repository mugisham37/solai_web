import { z } from "zod";
import { draftFormSchema } from "@/lib/schemas/draft-form";

/**
 * Editor fields share the build screen’s zod rules for title, price, stock
 * and description — one schema, two screens.
 */
export const productEditSchema = draftFormSchema
  .pick({
    title: true,
    priceMinor: true,
    stock: true,
    descriptionEn: true,
  })
  .extend({
    onSale: z.boolean(),
  });

export type ProductEditValues = z.infer<typeof productEditSchema>;
