import type { Metadata } from "next";
import { ComposeView } from "@/components/organisms/app/conversations/ComposeView";

export const metadata: Metadata = {
  title: "Compose message",
  description: "Send outbound messages to customer segments.",
};

export default function ComposePage() {
  return <ComposeView />;
}
