"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";

type PayoutErrorStateProps = {
  t: (key: string) => string;
  message?: string;
  onRetry: () => void;
  onBack: () => void;
};

export function PayoutErrorState({ t, message, onRetry, onBack }: PayoutErrorStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-3.5 py-8 text-center md:px-6">
      <div className="mx-auto flex max-w-[520px] flex-col items-center gap-4">
        <Icon name="alert" size="lg" className="size-12 text-clay" />
        <Heading level={1} size="display" className="text-d1 normal-case">
          {t("error.title")}
        </Heading>
        <Text className="text-ink-70">{message ?? t("error.lede")}</Text>
        <div className="flex flex-wrap justify-center gap-2">
          <ActionButton type="button" variant="sun" onClick={onRetry}>
            <Icon name="refresh" />
            {t("error.retry")}
          </ActionButton>
          <ActionButton type="button" variant="line" onClick={onBack}>
            {t("error.back")}
          </ActionButton>
        </div>
        <Text className="text-xs text-ink-45">{t("error.support")}</Text>
      </div>
    </div>
  );
}
