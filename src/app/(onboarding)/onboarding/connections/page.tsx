import type { Metadata } from "next";
import { ConnectionsStep } from "@/components/organisms/onboarding/ConnectionsStep";
import { requireSession } from "@/lib/auth/require-session";
import { getOrCreateOnboardingDraft } from "@/lib/actions/onboarding";

export const metadata: Metadata = {
  title: "Connect accounts",
  description: "Link your store, ads, and messaging platforms to SolAI.",
};

function getBannerMessage(
  connected?: string,
  error?: string,
): string | null {
  if (connected) return `${connected} connected successfully.`;
  if (error === "declined")
    return "Connection was declined. You can try again.";
  if (error === "invalid_state")
    return "Security check failed. Please try connecting again.";
  return null;
}

export default async function ConnectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  await requireSession();
  const draft = await getOrCreateOnboardingDraft();
  const params = await searchParams;
  const bannerMessage = getBannerMessage(params.connected, params.error);

  return <ConnectionsStep draft={draft} bannerMessage={bannerMessage} />;
}
