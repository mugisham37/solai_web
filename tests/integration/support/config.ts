/**
 * Connection config for the integration suite. Both values default to a
 * plain local docker-compose dev stack (see solai_server/docker/). If your
 * machine already has something bound to 5432/6379, start the backend with
 * a port-remapped compose override and point INTEGRATION_DATABASE_URL at
 * whatever host port you mapped postgres to.
 */
export const API_BASE_URL =
  process.env.INTEGRATION_API_BASE_URL ?? "http://localhost:8000";

export const DATABASE_URL =
  process.env.INTEGRATION_DATABASE_URL ??
  "postgresql://solai:solai@localhost:5432/solai";

// Sent as the Origin header on every request so the backend's
// verify_cookie_csrf check (refresh/logout/logout-all) is genuinely
// exercised rather than skipped for lacking an Origin header entirely.
export const TEST_ORIGIN = "http://localhost:3000";

export function uniqueEmail(label: string): string {
  // Pydantic's email-validator rejects RFC 2606 .test/.invalid/.local as
  // "special-use" domains, but not example.com/.org — matches the
  // convention solai_server's own pytest suite already uses.
  return `qa-${label}-${crypto.randomUUID()}@example.com`;
}
