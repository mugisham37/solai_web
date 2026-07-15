import { z } from "zod";
import { adSpendOptions, platformOptions } from "@/lib/data/contact";

export const contactFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  monthlyAdSpend: z.enum(adSpendOptions, {
    message: "Please select a monthly ad spend range",
  }),
  platform: z.enum(platformOptions, {
    message: "Please select a platform",
  }),
  message: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
