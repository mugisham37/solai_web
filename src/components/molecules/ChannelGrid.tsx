"use client";

import { ChannelButton } from "@/components/atoms/ChannelButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Text } from "@/components/atoms/Text";
import type { IconName } from "@/types/icon";
import type { ShareChannel } from "@/types/share";

/**
 * Platform brand colours, kept out of the theme tokens on purpose: these are
 * other companies' colours, not ours, and they exist so the grid is scannable.
 */
const CHANNELS: ReadonlyArray<{
  id: ShareChannel;
  icon: IconName;
  tileClassName: string;
}> = [
  { id: "fb", icon: "facebook", tileClassName: "bg-[#1877F2]" },
  { id: "ig", icon: "instagram", tileClassName: "bg-[linear-gradient(45deg,#F9CE34,#EE2A7B,#6228D7)]" },
  { id: "tg", icon: "telegram", tileClassName: "bg-[#28A8E9]" },
  { id: "x", icon: "xSocial", tileClassName: "bg-ink" },
  { id: "sms", icon: "message", tileClassName: "bg-[#7A8A89]" },
  { id: "mail", icon: "mail", tileClassName: "bg-[#C1553E]" },
  { id: "link", icon: "link", tileClassName: "bg-paper-2 !text-ink" },
  { id: "qr", icon: "qr", tileClassName: "bg-deep" },
  { id: "more", icon: "share", tileClassName: "bg-sun !text-sun-ink" },
];

type ChannelGridProps = {
  eyebrow: string;
  /** Label per channel, from i18n. */
  channelLabels: Readonly<Record<ShareChannel, string>>;
  sharedLabel: string;
  hint: string;
  sharedChannels: ReadonlySet<ShareChannel>;
  onSelect: (channel: ShareChannel) => void;
};

export function ChannelGrid({
  eyebrow,
  channelLabels,
  sharedLabel,
  hint,
  sharedChannels,
  onSelect,
}: ChannelGridProps) {
  return (
    <section className="rounded-card border border-hair bg-white p-4">
      <Eyebrow variant="quiet" className="mb-3">
        {eyebrow}
      </Eyebrow>

      <div className="grid grid-cols-3 gap-2 @[700px]:grid-cols-5">
        {CHANNELS.map((channel) => (
          <ChannelButton
            key={channel.id}
            icon={channel.icon}
            label={channelLabels[channel.id]}
            tileClassName={channel.tileClassName}
            shared={sharedChannels.has(channel.id)}
            sharedLabel={sharedLabel}
            onClick={() => onSelect(channel.id)}
          />
        ))}
      </div>

      {/* Says plainly why Instagram behaves differently, rather than letting a
          seller discover it by tapping a button that does nothing. */}
      <Text size="tiny" className="mt-3">
        {hint}
      </Text>
    </section>
  );
}
