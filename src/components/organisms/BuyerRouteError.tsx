"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { EmptyState } from "@/components/atoms/EmptyState";

type BuyerRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function BuyerRouteError({ error, reset }: BuyerRouteErrorProps) {
  const t = useTranslations("storefront");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4">
      <EmptyState
        icon="alert"
        title={t("errorTitle")}
        description={t("errorLede")}
        action={
          <ActionButton type="button" variant="sun" onClick={reset}>
            {t("errorRetry")}
          </ActionButton>
        }
      />
    </div>
  );
}
