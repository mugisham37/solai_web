import type { Metadata } from "next";
import { QuarantineView } from "@/components/organisms/app/conversations/QuarantineView";

export const metadata: Metadata = {
  title: "Quarantine",
  description: "Messages held back by Safety Agent.",
};

export default function QuarantinePage() {
  return <QuarantineView />;
}
