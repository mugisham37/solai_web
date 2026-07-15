import { NextResponse } from "next/server";
import {
  completeOAuthConnection,
  requireOAuthSession,
  validateOAuthState,
} from "@/lib/onboarding/oauth";
import type { ConnectionProvider } from "@/types/onboarding";

const CONNECTION_PROVIDERS = [
  "shopify",
  "woo",
  "meta",
  "google",
  "whatsapp",
] as const;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectBase = `${baseUrl}/onboarding/connections`;

  if (provider === "stripe") {
    const valid = await validateOAuthState("stripe", state);

    const paymentsRedirect = `${baseUrl}/onboarding/payments`;

    if (!valid) {
      return NextResponse.redirect(`${paymentsRedirect}?error=invalid_state`);
    }

    const { getOrCreateOnboardingDraft, saveOnboardingDraft } = await import(
      "@/lib/actions/onboarding"
    );
    const draft = await getOrCreateOnboardingDraft();
    draft.payments.stripe = {
      enabled: true,
      status: "connected",
      accountId: "acct_1N…7xQ",
    };
    await saveOnboardingDraft(draft, 2);

    return NextResponse.redirect(`${paymentsRedirect}?connected=stripe`);
  }

  if (
    !CONNECTION_PROVIDERS.includes(
      provider as (typeof CONNECTION_PROVIDERS)[number],
    )
  ) {
    return NextResponse.redirect(`${redirectBase}?error=unknown_provider`);
  }

  const session = await requireOAuthSession();
  const valid = await validateOAuthState(provider, state);

  if (!valid) {
    return NextResponse.redirect(`${redirectBase}?error=invalid_state`);
  }

  if (error === "access_denied") {
    await completeOAuthConnection(
      provider as ConnectionProvider,
      session.user.id,
      "You declined access on the provider consent screen.",
    );
    return NextResponse.redirect(`${redirectBase}?error=declined`);
  }

  await completeOAuthConnection(
    provider as ConnectionProvider,
    session.user.id,
  );

  return NextResponse.redirect(`${redirectBase}?connected=${provider}`);
}
