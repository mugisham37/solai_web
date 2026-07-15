"use server";

import { createPasskeyContextToken } from "@/lib/auth/passkey-context";

export async function createPasskeySignupContextAction(input: {
  email: string;
  name: string;
}) {
  return createPasskeyContextToken(input);
}
