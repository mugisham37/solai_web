import type { Metadata } from "next";
import { PaymentsStep } from "@/components/organisms/onboarding/PaymentsStep";

export const metadata: Metadata = {
  title: "Payment rails",
  description: "Configure Stripe and Mobile Money payment options for your customers.",
};

export default function PaymentsPage() {
  return <PaymentsStep />;
}
