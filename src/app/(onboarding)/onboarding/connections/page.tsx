import type { Metadata } from "next";
import { ConnectionsStep } from "@/components/organisms/onboarding/ConnectionsStep";

export const metadata: Metadata = {
  title: "Connect accounts",
  description: "Link your store, ads, and messaging platforms to SolAI.",
};

export default function ConnectionsPage() {
  return <ConnectionsStep />;
}
