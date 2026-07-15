import type { Metadata } from "next";
import { TemplatesView } from "@/components/organisms/app/conversations/TemplatesView";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Message templates",
  description: "Reusable message templates for automated send.",
};

export default async function TemplatesPage() {
  await requireOnboardedSession();

  return <TemplatesView />;
}
