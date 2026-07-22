import type { AuditEventResponse } from "@/lib/api/types";
import type { AuditActor, AuditEvent, EventTone } from "@/types/app";

function mapActor(actorType: string): AuditActor {
  if (actorType === "agent") return "agent";
  if (actorType === "human") return "human";
  if (actorType === "safety") return "safety";
  return "human";
}

function mapTone(tone: string): EventTone {
  if (tone === "danger") return "danger";
  if (tone === "warning" || tone === "warn") return "warning";
  if (tone === "success") return "success";
  return "info";
}

export function mapAuditEvent(event: AuditEventResponse): AuditEvent {
  const created = new Date(event.created_at);
  const metadata = event.metadata ?? {};
  const who =
    typeof metadata.actor_email === "string"
      ? metadata.actor_email
      : typeof metadata.email === "string"
        ? metadata.email
        : event.actor_type;

  const metaParts = Object.entries(metadata)
    .filter(([key]) => !["actor_email", "email"].includes(key))
    .map(([, value]) => String(value))
    .filter(Boolean);

  return {
    id: event.id,
    time: created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    day: created.toLocaleDateString([], { month: "short", day: "numeric" }),
    who,
    actor: mapActor(event.actor_type),
    action: event.action,
    meta: metaParts.join(" · ") || "—",
    tone: mapTone(event.tone),
  };
}
