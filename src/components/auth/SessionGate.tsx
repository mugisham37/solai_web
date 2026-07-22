"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";

function SessionLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-text-muted" />
    </div>
  );
}

export function RequireSession({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") return <SessionLoading />;
  if (status === "unauthenticated") return null;
  return <>{children}</>;
}

export function RequireOnboarded({ children }: { children: React.ReactNode }) {
  const { user, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated" && user && !user.email_verified) {
      router.replace("/verify-email");
      return;
    }
    if (status === "authenticated" && user && !user.onboarding_completed) {
      router.replace("/onboarding");
    }
  }, [status, user, router]);

  if (status === "loading") return <SessionLoading />;

  if (
    status === "unauthenticated" ||
    !user ||
    !user.email_verified ||
    !user.onboarding_completed
  ) {
    return null;
  }

  return <>{children}</>;
}
