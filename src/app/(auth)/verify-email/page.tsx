"use client";

import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/organisms/auth/VerifyEmailForm";
import { useSession } from "@/providers/session-provider";

function VerifyEmailContent() {
  const { user, status } = useSession();

  if (status === "loading") return null;
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
    return null;
  }

  return <VerifyEmailForm email={user.email} />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
