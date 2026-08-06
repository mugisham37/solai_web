"use client";

import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";

type DashboardRouteErrorProps = {
  reset: () => void;
};

export function DashboardRouteError({ reset }: DashboardRouteErrorProps) {
  const t = useTranslations("dashboard");

  return (
    <section className="flex flex-col items-start gap-3 rounded-card border border-hair bg-white p-5">
      <Icon name="alert" size="lg" className="size-10 text-clay" />
      <h2 className="font-display text-d2 font-extrabold text-ink uppercase">
        {t("error.title")}
      </h2>
      <p className="max-w-prose text-sm text-ink-70">{t("error.lede")}</p>
      <ActionButton type="button" variant="sun" onClick={reset}>
        <Icon name="refresh" />
        {t("error.retry")}
      </ActionButton>
    </section>
  );
}
