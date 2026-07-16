import type { CampaignState, ConversationStatus } from "@/types/app";
import { cn } from "@/lib/utils";

const campaignStateConfig: Record<
  CampaignState,
  { bg: string; color: string; label: string }
> = {
  live: {
    bg: "rgba(52,211,153,0.12)",
    color: "var(--success)",
    label: "Live",
  },
  learning: {
    bg: "rgba(122,167,255,0.12)",
    color: "var(--info)",
    label: "Learning",
  },
  paused: {
    bg: "rgba(255,181,71,0.12)",
    color: "var(--warning)",
    label: "Paused",
  },
  draft: {
    bg: "var(--surface-2)",
    color: "var(--text-muted)",
    label: "Draft",
  },
};

interface StatePillProps {
  state: CampaignState;
  className?: string;
}

export function StatePill({ state, className }: StatePillProps) {
  const config = campaignStateConfig[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      style={{ background: config.bg, color: config.color }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: config.color }}
        aria-hidden
      />
      {config.label}
    </span>
  );
}

const conversationStatusConfig: Record<
  ConversationStatus,
  { bg: string; color: string; label: string }
> = {
  "agent-handling": {
    bg: "rgba(91,124,255,0.12)",
    color: "#5B7CFF",
    label: "Agent handling",
  },
  "needs-human": {
    bg: "rgba(255,181,71,0.12)",
    color: "#FFB547",
    label: "Needs you",
  },
  closed: {
    bg: "rgba(52,211,153,0.12)",
    color: "#34D399",
    label: "Won",
  },
  quarantine: {
    bg: "rgba(249,112,102,0.12)",
    color: "#F97066",
    label: "Quarantined",
  },
};

interface ConversationStatusPillProps {
  status: ConversationStatus;
  className?: string;
}

export function ConversationStatusPill({
  status,
  className,
}: ConversationStatusPillProps) {
  const config = conversationStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-medium",
        className
      )}
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}
