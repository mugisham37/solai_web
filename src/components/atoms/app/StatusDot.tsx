import { cn } from "@/lib/utils";
import type { AgentHealth, EventTone } from "@/types/app";

const healthLabels: Record<AgentHealth, string> = {
  running: "Running",
  idle: "Idle",
  paused: "Paused",
  errored: "Errored",
};

const healthColors: Record<AgentHealth, string> = {
  running: "bg-success",
  idle: "bg-info",
  paused: "bg-text-subtle",
  errored: "bg-danger",
};

const toneColors: Record<EventTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

interface HealthDotProps {
  health: AgentHealth;
  className?: string;
}

export function HealthDot({ health, className }: HealthDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <span
        className={cn("size-2 rounded-full", healthColors[health])}
        aria-hidden
      />
      {healthLabels[health]}
    </span>
  );
}

interface StatusDotProps {
  tone: EventTone;
  className?: string;
}

export function StatusDot({ tone, className }: StatusDotProps) {
  return (
    <span
      className={cn("size-2 shrink-0 rounded-full", toneColors[tone], className)}
      aria-hidden
    />
  );
}
