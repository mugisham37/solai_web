import { cookies } from "next/headers";
import { DEMO_AGENTS } from "@/data/console-nav";
import type { ConsoleAgent, ConsoleRole } from "@/types/console";

/** Separate from seller draft / buyer checkout cookies by construction. */
export const CONSOLE_SESSION_COOKIE = "solai_console_session";

const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

type SessionPayload = {
  agentId: string;
  name: string;
  initials: string;
  role: ConsoleRole;
};

function isRole(value: unknown): value is ConsoleRole {
  return value === "support" || value === "finance" || value === "admin";
}

function parsePayload(raw: string): SessionPayload | null {
  try {
    const data = JSON.parse(raw) as Partial<SessionPayload>;
    if (
      typeof data.agentId === "string" &&
      typeof data.name === "string" &&
      typeof data.initials === "string" &&
      isRole(data.role)
    ) {
      return {
        agentId: data.agentId,
        name: data.name,
        initials: data.initials,
        role: data.role,
      };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export async function getConsoleSession(): Promise<ConsoleAgent | null> {
  const jar = await cookies();
  const raw = jar.get(CONSOLE_SESSION_COOKIE)?.value;
  if (!raw) return null;
  const payload = parsePayload(raw);
  if (!payload) return null;
  return {
    id: payload.agentId,
    name: payload.name,
    initials: payload.initials,
    role: payload.role,
  };
}

export async function setConsoleSession(agent: ConsoleAgent): Promise<void> {
  const jar = await cookies();
  const payload: SessionPayload = {
    agentId: agent.id,
    name: agent.name,
    initials: agent.initials,
    role: agent.role,
  };
  jar.set(CONSOLE_SESSION_COOKIE, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearConsoleSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(CONSOLE_SESSION_COOKIE);
}

export function agentForRole(role: ConsoleRole): ConsoleAgent {
  const found = DEMO_AGENTS.find((a) => a.role === role);
  return found ?? DEMO_AGENTS[0];
}

export async function requireConsoleAgent(): Promise<
  | { ok: true; agent: ConsoleAgent }
  | { ok: false; error: "unauthenticated" }
> {
  const agent = await getConsoleSession();
  if (!agent) return { ok: false, error: "unauthenticated" };
  return { ok: true, agent };
}
