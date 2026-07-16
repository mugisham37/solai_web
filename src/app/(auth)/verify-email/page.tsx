"use client";

import { VerifyEmailForm } from "@/components/organisms/auth/VerifyEmailForm";
import { useDemoSession } from "@/hooks/use-demo-session";

export default function VerifyEmailPage() {
  const { session } = useDemoSession();

  return <VerifyEmailForm email={session?.email ?? "you@solai.app"} />;
}
