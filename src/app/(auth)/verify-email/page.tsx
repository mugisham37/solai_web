import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "@/components/organisms/auth/VerifyEmailForm";
import { getPendingEmailCookie } from "@/lib/auth/pending-email";

export const metadata: Metadata = {
  title: "Verify email",
  description: "Verify your email address to continue.",
};

export default async function VerifyEmailPage() {
  const email = await getPendingEmailCookie();
  if (!email) {
    redirect("/signup");
  }

  return <VerifyEmailForm email={email} />;
}
