"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/hooks/use-demo-session";

export function RequireSession({ children }: { children: React.ReactNode }) {
  const { session, ready } = useDemoSession();
  const router = useRouter();

  useEffect(() => {
    if (ready && !session) {
      router.replace("/login");
    }
  }, [ready, session, router]);

  if (!ready || !session) return null;
  return <>{children}</>;
}

export function RequireOnboarded({ children }: { children: React.ReactNode }) {
  const { session, ready } = useDemoSession();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace("/login");
    } else if (!session.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [ready, session, router]);

  if (!ready || !session || !session.onboardingComplete) return null;
  return <>{children}</>;
}
