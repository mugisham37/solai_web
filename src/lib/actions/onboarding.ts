"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { onboardingDraft } from "@/lib/db/schema";
import { createDefaultDraft } from "@/lib/onboarding/defaults";
import {
  deserializeDraft,
  serializeDraft,
} from "@/lib/onboarding/serialize";
import type {
  ConnectionProvider,
  OnboardingDraft,
  OnboardingStepIndex,
  PaymentRail,
} from "@/types/onboarding";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session.user.id;
}

export async function getOnboardingDraft(): Promise<OnboardingDraft | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const row = await db.query.onboardingDraft.findFirst({
    where: eq(onboardingDraft.userId, userId),
  });

  if (!row) return null;
  return deserializeDraft(row);
}

export async function getOrCreateOnboardingDraft(): Promise<OnboardingDraft> {
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const existing = await db.query.onboardingDraft.findFirst({
    where: eq(onboardingDraft.userId, userId),
  });

  if (existing) return deserializeDraft(existing);

  const draft = createDefaultDraft();
  const serialized = serializeDraft(draft);

  await db.insert(onboardingDraft).values({
    userId,
    currentStep: draft.currentStep,
    ...serialized,
  });

  return draft;
}

export async function saveOnboardingDraft(
  draft: OnboardingDraft,
  step?: OnboardingStepIndex,
) {
  const userId = await getUserId();
  if (!userId) return { success: false as const, error: "Unauthorized" };

  const nextDraft = {
    ...draft,
    currentStep: step ?? draft.currentStep,
  };
  const serialized = serializeDraft(nextDraft);

  await db
    .insert(onboardingDraft)
    .values({
      userId,
      currentStep: nextDraft.currentStep,
      ...serialized,
    })
    .onConflictDoUpdate({
      target: onboardingDraft.userId,
      set: {
        currentStep: nextDraft.currentStep,
        ...serialized,
        updatedAt: new Date(),
      },
    });

  return { success: true as const };
}

export async function saveAndExitAction() {
  const draft = await getOrCreateOnboardingDraft();
  await saveOnboardingDraft(draft);
  redirect("/dashboard");
}

export async function updateConnectionsAction(
  connections: OnboardingDraft["connections"],
  step: OnboardingStepIndex = 1,
) {
  const draft = await getOrCreateOnboardingDraft();
  return saveOnboardingDraft({ ...draft, connections }, step);
}

export async function updatePaymentsAction(
  payments: OnboardingDraft["payments"],
  step: OnboardingStepIndex = 2,
) {
  const draft = await getOrCreateOnboardingDraft();
  return saveOnboardingDraft({ ...draft, payments }, step);
}

export async function updateProductBudgetAction(
  data: Pick<OnboardingDraft, "product" | "audience" | "budget">,
  step: OnboardingStepIndex = 3,
) {
  const draft = await getOrCreateOnboardingDraft();
  return saveOnboardingDraft({ ...draft, ...data }, step);
}

export async function launchCampaignAction() {
  const userId = await getUserId();
  if (!userId) return { success: false as const, error: "Unauthorized" };

  const draft = await getOrCreateOnboardingDraft();

  // Simulated launch — 90% success rate for demo
  const failed = Math.random() < 0.1;

  const launch = failed
    ? {
        status: "failed" as const,
        errorReason:
          "Campaign creation service is temporarily unavailable. Your review data is saved.",
      }
    : {
        status: "success" as const,
        launchedAt: new Date().toISOString(),
      };

  const nextDraft: OnboardingDraft = {
    ...draft,
    launch,
    currentStep: 4,
    completedAt: failed ? null : new Date().toISOString(),
  };

  await saveOnboardingDraft(nextDraft, 4);

  if (!failed) {
    await db
      .update(onboardingDraft)
      .set({ completedAt: new Date() })
      .where(eq(onboardingDraft.userId, userId));
  }

  return { success: !failed, launch };
}

export async function connectProviderAction(provider: ConnectionProvider) {
  const draft = await getOrCreateOnboardingDraft();
  const connections = {
    ...draft.connections,
    [provider]: { ...draft.connections[provider], status: "connecting" as const },
  };
  await saveOnboardingDraft({ ...draft, connections });

  return {
    redirectUrl: `/api/onboarding/oauth/${provider}/start`,
  };
}

export async function disconnectProviderAction(provider: ConnectionProvider) {
  const draft = await getOrCreateOnboardingDraft();
  const connections = {
    ...draft.connections,
    [provider]: { status: "idle" as const },
  };
  return saveOnboardingDraft({ ...draft, connections });
}

export async function connectPaymentRailAction(
  rail: PaymentRail,
  credentials?: { merchantId: string },
) {
  const draft = await getOrCreateOnboardingDraft();
  const payments = {
    ...draft.payments,
    [rail]: {
      ...draft.payments[rail],
      enabled: true,
      status: "connecting" as const,
    },
  };
  await saveOnboardingDraft({ ...draft, payments });

  if (rail === "stripe") {
    return { redirectUrl: `/api/onboarding/oauth/stripe/start` };
  }

  // Demo credential validation
  await new Promise((r) => setTimeout(r, 800));

  const merchantId = credentials?.merchantId ?? `MM-${Math.floor(Math.random() * 9000 + 1000)}`;
  const updated = await getOrCreateOnboardingDraft();
  const nextPayments = {
    ...updated.payments,
    [rail]: {
      enabled: true,
      status: "connected" as const,
      merchantId,
    },
  };
  await saveOnboardingDraft({ ...updated, payments: nextPayments });
  return { success: true as const };
}

export async function advanceWelcomeStep() {
  const draft = await getOrCreateOnboardingDraft();
  await saveOnboardingDraft(draft, 1);
  return { success: true as const };
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const row = await db.query.onboardingDraft.findFirst({
    where: eq(onboardingDraft.userId, userId),
  });

  return Boolean(row?.completedAt);
}
