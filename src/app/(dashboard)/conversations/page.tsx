import type { Metadata } from "next";
import { InboxView } from "@/components/organisms/app/conversations/InboxView";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Conversations",
  description: "Inbox, threads, and customer conversations.",
};

export default async function ConversationsPage() {
  await requireOnboardedSession();

  return <InboxView />;
}
