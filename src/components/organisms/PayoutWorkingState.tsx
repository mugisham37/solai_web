"use client";

import { Spinner } from "@/components/atoms/Spinner";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";

type PayoutWorkingStateProps = {
  t: (key: string) => string;
  phase: "verify" | "link" | "migrate";
};

export function PayoutWorkingState({ t, phase }: PayoutWorkingStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-3.5 py-8 text-center md:px-6">
      <div className="mx-auto flex max-w-[340px] flex-col items-center gap-4">
        <Spinner label={t("working.title")} />
        <div>
          <Heading level={2} size="display" className="text-d2 normal-case">
            {t("working.title")}
          </Heading>
          <Text className="mt-2 text-ink-70">{t("working.lede")}</Text>
        </div>
        <div className="flex w-full flex-col gap-2 text-left">
          <div className="flex items-center gap-2">
            <IconTile variant="sea" className="size-7 rounded-lg">
              <Icon name="check" size="sm" />
            </IconTile>
            <Text size="small">{t("working.stepVerified")}</Text>
          </div>
          <div className="flex items-center gap-2">
            <IconTile variant="sea" className="size-7 rounded-lg">
              <Icon name="check" size="sm" />
            </IconTile>
            <Text size="small">{phase === "verify" ? t("working.stepLinkPending") : t("working.stepLinked")}</Text>
          </div>
          <div className="flex items-center gap-2">
            <IconTile variant="neutral" className="size-7 rounded-lg">
              <Icon name="store" size="sm" />
            </IconTile>
            <Text size="small">
              {phase === "migrate" ? t("working.stepMigrating") : t("working.stepMigratePending")}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
