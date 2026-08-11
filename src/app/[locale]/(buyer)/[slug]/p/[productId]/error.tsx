"use client";

import { BuyerRouteError } from "@/components/organisms/BuyerRouteError";

export default function ProductError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <BuyerRouteError {...props} />;
}
