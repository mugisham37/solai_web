"use client";

import { ConsoleRouteError } from "@/components/organisms/ConsoleRouteError";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ConsoleRouteError reset={reset} />;
}
