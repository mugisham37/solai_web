"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Text } from "@/components/atoms/Text";

type UnsupportedNetworkStateProps = {
  t: (key: string) => string;
  onChooseOther: () => void;
};

export function UnsupportedNetworkState({ t, onChooseOther }: UnsupportedNetworkStateProps) {
  return (
    <div className="mx-auto flex max-w-[600px] flex-col gap-4 px-3.5 py-4 md:px-6 md:py-8">
      <IconTile variant="neutral" className="size-[52px] rounded-2xl bg-clay/10 text-clay">
        <Icon name="alert" size="lg" />
      </IconTile>
      <Heading level={1} size="display" className="text-d1 normal-case">
        {t("unsupported.title")}
      </Heading>
      <Text className="text-ink-70">{t("unsupported.lede")}</Text>
      <div className="rounded-card bg-paper-2 p-4">
        <p className="mb-2 font-bold">{t("unsupported.optionsTitle")}</p>
        <ul className="flex list-none flex-col gap-1 text-sm text-ink-70">
          <li>{t("unsupported.option1")}</li>
          <li>{t("unsupported.option2")}</li>
        </ul>
      </div>
      <Text className="text-sm text-ink-70">{t("unsupported.feedback")}</Text>
      <ActionButton type="button" variant="sun" onClick={onChooseOther}>
        {t("unsupported.cta")}
      </ActionButton>
    </div>
  );
}
