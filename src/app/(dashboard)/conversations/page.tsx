import type { Metadata } from "next";
import { InboxView } from "@/components/organisms/app/conversations/InboxView";

export const metadata: Metadata = {
  title: "Conversations",
  description: "Inbox, threads, and customer conversations.",
};

export default function ConversationsPage() {
  return <InboxView />;
}
