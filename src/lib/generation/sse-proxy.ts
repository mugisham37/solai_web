import { cookies } from "next/headers";
import { getSolaiApiBaseUrl } from "@/lib/api/solai-server";
import { JOB_ID_HEADER } from "@/lib/generation/protocol";

const DRAFT_COOKIE = "solai_draft_token";

/**
 * Pipes a FastAPI SSE response through the BFF untouched.
 *
 * The browser never gets the API origin, so every generation stream — start
 * and resume alike — comes back through here.
 */
export async function proxyGenerationStream(
  path: string,
  init: { method: "GET" | "POST"; body?: string; headers?: Record<string, string> },
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(DRAFT_COOKIE)?.value;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const upstream = await fetch(`${getSolaiApiBaseUrl()}${path}`, {
    method: init.method,
    headers: {
      "Content-Type": "application/json",
      "X-Solai-Draft-Token": token,
      Cookie: `${DRAFT_COOKIE}=${token}`,
      ...init.headers,
    },
    body: init.body,
    cache: "no-store",
  });

  const headers = new Headers({
    "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  const jobId = upstream.headers.get(JOB_ID_HEADER);
  if (jobId) {
    headers.set(JOB_ID_HEADER, jobId);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
