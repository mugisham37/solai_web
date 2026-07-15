"use server";

import { contactFormSchema } from "@/lib/validations/contact";

export type ContactActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitContactForm(
  data: unknown,
): Promise<ContactActionState> {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  console.log("[contact-form]", JSON.stringify(parsed.data, null, 2));

  return { success: true };
}
