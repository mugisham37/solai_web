"use client";

import { DashboardRouteError } from "@/components/organisms/DashboardRouteError";

export default function GrowError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <DashboardRouteError reset={reset} />;
}
