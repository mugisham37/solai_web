"use client";

import { DashboardRouteError } from "@/components/organisms/DashboardRouteError";

export default function PlansError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <DashboardRouteError reset={reset} />;
}
