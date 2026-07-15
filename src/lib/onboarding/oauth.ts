import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { onboardingDraft } from "@/lib/db/schema";
import { DEMO_CONNECTED_LABELS } from "@/lib/onboarding/constants";
import { createDefaultDraft } from "@/lib/onboarding/defaults";
import {
  deserializeDraft,
  serializeDraft,
} from "@/lib/onboarding/serialize";
import type { ConnectionProvider } from "@/types/onboarding";

const OAUTH_STATE_COOKIE = "solai_oauth_state";

export async function createOAuthState(provider: string) {
  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, `${provider}:${state}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return state;
}

export async function validateOAuthState(
  provider: string,
  state: string | null,
) {
  const cookieStore = await cookies();
  const stored = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(OAUTH_STATE_COOKIE);
  return stored === `${provider}:${state}`;
}

export async function completeOAuthConnection(
  provider: ConnectionProvider,
  userId: string,
  error?: string,
) {
  const row = await db.query.onboardingDraft.findFirst({
    where: eq(onboardingDraft.userId, userId),
  });

  const draft = row
    ? deserializeDraft(row)
    : { ...createDefaultDraft(), currentStep: 1 as const };

  if (error) {
    draft.connections[provider] = {
      status: "error",
      errorReason: error,
    };
  } else {
    draft.connections[provider] = {
      status: "connected",
      accountName: DEMO_CONNECTED_LABELS[provider]?.split(" · ")[0]?.replace(
        "Connected as ",
        "",
      ),
      accountId:
        provider === "meta"
          ? "1847293"
          : provider === "whatsapp"
            ? "+250788123456"
            : undefined,
    };
  }

  const serialized = serializeDraft(draft);
  await db
    .insert(onboardingDraft)
    .values({ userId, currentStep: 1, ...serialized })
    .onConflictDoUpdate({
      target: onboardingDraft.userId,
      set: { ...serialized, updatedAt: new Date() },
    });
}

export async function requireOAuthSession() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });
  if (!session) redirect("/login");
  return session;
}
