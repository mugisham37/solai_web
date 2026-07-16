import type { Metadata } from "next";
import { TemplatesView } from "@/components/organisms/app/conversations/TemplatesView";

export const metadata: Metadata = {
  title: "Message templates",
  description: "Reusable message templates for automated send.",
};

export default function TemplatesPage() {
  return <TemplatesView />;
}
