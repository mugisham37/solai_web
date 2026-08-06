"use client";

import { ActionButton } from "@/components/atoms/ActionButton";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";

type WhatsAppCardLabels = Readonly<{
  title: string;
  subtitle: string;
  chatAction: string;
  statusAction: string;
  hint: string;
}>;

type WhatsAppCardProps = {
  labels: WhatsAppCardLabels;
  onSendToChat: () => void;
  onPostAsStatus: () => void;
  statusBusy?: boolean;
};

/**
 * First and largest, at every width.
 *
 * Almost every first sale in this market comes from someone the seller already
 * knows, and this is where those people are. A wide screen must not quietly
 * demote it into the generic channel grid.
 */
export function WhatsAppCard({
  labels,
  onSendToChat,
  onPostAsStatus,
  statusBusy = false,
}: WhatsAppCardProps) {
  return (
    <section className="rounded-card border border-whatsapp/35 bg-gradient-to-b from-whatsapp/[0.07] to-transparent p-4">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-whatsapp text-white"
          aria-hidden
        >
          <Icon name="whatsapp" />
        </span>
        <div className="min-w-0 flex-1">
          <Heading level={2} size="h3" className="text-d3">
            {labels.title}
          </Heading>
          <Text size="tiny" className="mt-0.5">
            {labels.subtitle}
          </Text>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ActionButton type="button" variant="whatsapp" onClick={onSendToChat}>
          <Icon name="whatsapp" size="sm" />
          {labels.chatAction}
        </ActionButton>

        <ActionButton
          type="button"
          variant="line"
          onClick={onPostAsStatus}
          disabled={statusBusy}
        >
          <Icon name="image" size="sm" />
          {labels.statusAction}
        </ActionButton>
      </div>

      <Text size="tiny" className="mt-2.5">
        {labels.hint}
      </Text>
    </section>
  );
}
