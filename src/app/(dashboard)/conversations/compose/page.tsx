import type { Metadata } from "next";
import { ComposeView } from "@/components/organisms/app/conversations/ComposeView";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Compose message",
  description: "Send outbound messages to customer segments.",
};

export default async function ComposePage() {
  await requireOnboardedSession();

  return <ComposeView />;
}
