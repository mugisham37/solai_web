"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";

type HolderConfirmCardProps = {
  holderName: string;
  maskedDestination: string;
  confirmLabel: string;
  rejectLabel: string;
  onConfirm: () => void;
  onReject: () => void;
};

export function HolderConfirmCard({
  holderName,
  maskedDestination,
  confirmLabel,
  rejectLabel,
  onConfirm,
  onReject,
}: HolderConfirmCardProps) {
  return (
    <>
      <div className="rounded-card border border-hair bg-white px-4 py-6 text-center">
        <IconTile variant="sea" className="mx-auto mb-3 size-[52px] rounded-2xl">
          <Icon name="user" size="lg" />
        </IconTile>
        <Heading level={2} size="display" className="text-d2 normal-case">
          {holderName}
        </Heading>
        <Text className="mt-1 text-ink-70">{maskedDestination}</Text>
      </div>
      <div className="flex flex-wrap gap-2">
        <ActionButton type="button" variant="sun" onClick={onConfirm}>
          {confirmLabel}
          <Icon name="arrowRight" />
        </ActionButton>
        <ActionButton type="button" variant="line" onClick={onReject}>
          {rejectLabel}
        </ActionButton>
      </div>
    </>
  );
}
