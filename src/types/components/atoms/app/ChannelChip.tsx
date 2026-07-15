import type { Channel } from "@/types/app";
import { cn } from "@/lib/utils";

const channelConfig: Record<
  Channel,
  { bg: string; color: string; label: string }
> = {
  meta: {
    bg: "rgba(91,124,255,0.12)",
    color: "#5B7CFF",
    label: "Meta",
  },
  google: {
    bg: "rgba(255,181,71,0.12)",
    color: "#FFB547",
    label: "Google",
  },
  whatsapp: {
    bg: "rgba(52,211,153,0.12)",
    color: "#34D399",
    label: "WhatsApp",
  },
  instagram: {
    bg: "rgba(225,48,108,0.12)",
    color: "#E1306C",
    label: "Instagram",
  },
};

interface ChannelChipProps {
  channel: Channel;
  className?: string;
}

export function ChannelChip({ channel, className }: ChannelChipProps) {
  const config = channelConfig[channel];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

const dotColors: Record<Channel, string> = {
  whatsapp: "#25D366",
  instagram: "#E1306C",
  meta: "#1877F2",
  google: "#4285F4",
};

interface ChannelDotProps {
  channel: Channel;
  className?: string;
}

export function ChannelDot({ channel, className }: ChannelDotProps) {
  return (
    <span
      className={cn(
        "absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-surface",
        className
      )}
      style={{ background: dotColors[channel] }}
      aria-label={channelConfig[channel].label}
    />
  );
}
