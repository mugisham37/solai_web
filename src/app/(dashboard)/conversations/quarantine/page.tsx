import type { Metadata } from "next";
import { QuarantineView } from "@/components/organisms/app/conversations/QuarantineView";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Quarantine",
  description: "Messages held back by Safety Agent.",
};

export default async function QuarantinePage() {
  await requireOnboardedSession();

  return <QuarantineView />;
}
