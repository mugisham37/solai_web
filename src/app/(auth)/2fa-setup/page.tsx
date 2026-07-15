import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TwoFactorSetupFlow } from "@/components/organisms/auth/TwoFactorSetupFlow";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Set up 2FA",
  description: "Secure your SolAI account with two-factor authentication.",
};

export default async function TwoFactorSetupPage() {
  // Canonical session-check pattern for protected auth routes.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <TwoFactorSetupFlow />;
}
