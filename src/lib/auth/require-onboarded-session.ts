import { redirect } from "next/navigation";
import { hasCompletedOnboarding } from "@/lib/actions/onboarding";
import { requireSession } from "@/lib/auth/require-session";

export async function requireOnboardedSession() {
  const session = await requireSession();
  const completed = await hasCompletedOnboarding();

  if (!completed) {
    redirect("/onboarding");
  }

  return session;
}
