"use client";

import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";

type ConsoleRouteErrorProps = {
  reset: () => void;
};

export function ConsoleRouteError({ reset }: ConsoleRouteErrorProps) {
  const t = useTranslations("console");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <h2 className="font-display text-d2 font-extrabold tracking-tight text-ink uppercase">
        {t("error.title")}
      </h2>
      <p className="text-sm text-ink-70">{t("error.lede")}</p>
      <ActionButton type="button" variant="line" onClick={reset}>
        {t("error.retry")}
      </ActionButton>
    </div>
  );
}
