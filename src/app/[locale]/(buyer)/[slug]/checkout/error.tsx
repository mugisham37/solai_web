"use client";

import { BuyerRouteError } from "@/components/organisms/BuyerRouteError";

export default function CheckoutError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <BuyerRouteError {...props} />;
}
