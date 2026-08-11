import { z } from "zod";

export const draftFormSchema = z.object({
  title: z.string().min(1).max(70),
  priceMinor: z.number().positive(),
  stock: z.number().int().nonnegative(),
  madeToOrder: z.boolean(),
  descriptionEn: z.string().min(1),
  descriptionRw: z.string().min(1),
  variants: z.array(z.string()),
  condition: z.enum(["new", "used-good", "used-fair"]),
  leadTimeDays: z.number().int().positive().optional(),
  weightGrams: z.number().positive().optional(),
  courierEnabled: z.boolean(),
  pickupEnabled: z.boolean(),
});

export type DraftFormValues = z.infer<typeof draftFormSchema>;
