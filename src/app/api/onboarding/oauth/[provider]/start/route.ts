import { NextResponse } from "next/server";
import {
  createOAuthState,
  requireOAuthSession,
} from "@/lib/onboarding/oauth";

const VALID_PROVIDERS = [
  "shopify",
  "woo",
  "meta",
  "google",
  "whatsapp",
  "stripe",
] as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;

  if (!VALID_PROVIDERS.includes(provider as (typeof VALID_PROVIDERS)[number])) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  await requireOAuthSession();
  const state = await createOAuthState(provider);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const callbackUrl = `${baseUrl}/api/onboarding/oauth/${provider}/callback?state=${state}`;

  // Demo mode — simulate OAuth redirect round-trip
  return NextResponse.redirect(callbackUrl);
}
