import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/molecules/app/EmptyState";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Orders",
  description: "Order management — coming soon.",
};

export default async function OrdersPage() {
  await requireOnboardedSession();

  return (
    <EmptyState
      icon={ShoppingBag}
      title="Orders coming soon"
      description="Track MoMo, Airtel, and card orders in one place. Your agents already confirm sales — this view will show the full order history."
    />
  );
}
