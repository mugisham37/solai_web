import { z } from "zod";
import { onboardingCurrencies } from "@/lib/currency";

export const productBudgetSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    price: z
      .string()
      .min(1, "Price is required")
      .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
        message: "Enter a valid positive price",
      }),
    currency: z.enum(onboardingCurrencies),
    productUrl: z
      .string()
      .refine((v) => !v || /^https?:\/\/.+/.test(v), {
        message: "Enter a valid URL starting with http:// or https://",
      }),
    idealCustomer: z
      .string()
      .min(10, "Describe your ideal customer in a few words"),
    regions: z.array(z.string()).min(1, "Add at least one region"),
    languages: z.array(z.string()).min(1, "Add at least one language"),
    dailyCap: z.number().min(10).max(2000),
    totalCap: z.number().min(100).max(50000),
  })
  .refine((data) => data.totalCap >= data.dailyCap, {
    message: "Total campaign cap must be at least your daily spend cap",
    path: ["totalCap"],
  });

export const credentialSchema = z.object({
  merchantId: z.string().min(3, "Merchant ID is required"),
  apiKey: z.string().min(8, "API key is required"),
});

export type ProductBudgetValues = z.infer<typeof productBudgetSchema>;
