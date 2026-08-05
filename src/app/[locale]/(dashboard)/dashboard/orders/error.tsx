"use client";

import { DashboardRouteError } from "@/components/organisms/DashboardRouteError";

export default function OrdersError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <DashboardRouteError reset={reset} />;
}
