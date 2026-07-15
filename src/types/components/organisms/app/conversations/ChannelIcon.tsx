import type { Channel } from "@/types/app";
import { cn } from "@/lib/utils";

interface ChannelIconProps {
  channel: Channel;
  size?: number;
  className?: string;
}

export function ChannelIcon({ channel, size = 18, className }: ChannelIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn("shrink-0", className),
  };

  switch (channel) {
    case "whatsapp":
      return (
        <svg {...props}>
          <path d="M17.5 13.5c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-1.6-.8-3-2-3.9-3.7-.2-.4 0-.6.2-.8.1-.1.3-.4.4-.6.1-.2.2-.4 0-.6-.1-.2-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.9 5 .8.3 1.5.5 2 .7.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.6-.4z" />
          <path d="M3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5c-1.5 0-2.9-.4-4.1-1.1L3 21l1.6-4.5c-.7-1.3-1.1-2.8-1.1-4.5z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...props}>
          <rect width="20" height="20" x="2" y="2" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" />
        </svg>
      );
    case "meta":
      return (
        <svg {...props}>
          <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12z" />
          <path d="M7 16V8l5 4 5-4v8" />
        </svg>
      );
    case "google":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    default:
      return null;
  }
}
