"use server";

import { setPendingEmailCookie } from "@/lib/auth/pending-email";

export async function storePendingEmailAction(email: string) {
  await setPendingEmailCookie(email);
}
