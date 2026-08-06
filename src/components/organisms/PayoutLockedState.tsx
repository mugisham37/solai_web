"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Text } from "@/components/atoms/Text";
import { OTP_LOCKOUT_MINUTES } from "@/types/payout";

type PayoutT = (key: string, values?: Record<string, string | number>) => string;

type PayoutLockedStateProps = {
  t: PayoutT;
  lockoutUntil: string;
  onDifferentNumber: () => void;
};

export function PayoutLockedState({ t, lockoutUntil: _lockoutUntil, onDifferentNumber }: PayoutLockedStateProps) {
  const mins = OTP_LOCKOUT_MINUTES;
  void _lockoutUntil;
  return (
    <div className="mx-auto flex max-w-[600px] flex-col gap-4 px-3.5 py-4 md:px-6 md:py-8">
      <IconTile variant="neutral" className="size-[52px] rounded-2xl bg-clay/10 text-clay">
        <Icon name="lock" size="lg" />
      </IconTile>
      <Heading level={1} size="display" className="text-d1 normal-case">
        {t("locked.title")}
      </Heading>
      <Text className="text-ink-70">{t("locked.lede", { minutes: mins })}</Text>
      <div className="rounded-card bg-paper-2 p-4">
        <p className="mb-2 font-bold">{t("locked.whileTitle")}</p>
        <ul className="flex list-none flex-col gap-1 text-sm text-ink-70">
          <li>{t("locked.bullet1")}</li>
          <li>{t("locked.bullet2")}</li>
          <li>{t("locked.bullet3")}</li>
        </ul>
      </div>
      <div className="flex flex-wrap gap-2">
        <ActionButton type="button" variant="line" onClick={onDifferentNumber}>
          {t("locked.differentNumber")}
        </ActionButton>
        <ActionButton type="button" variant="line" asChild>
          <a href="https://wa.me/" target="_blank" rel="noreferrer">
            <Icon name="whatsapp" />
            {t("locked.whatsapp")}
          </a>
        </ActionButton>
      </div>
      <Text className="text-xs text-ink-45">{t("locked.timer", { minutes: mins })}</Text>
    </div>
  );
}
