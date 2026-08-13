import { cookies } from "next/headers";
import { getSolaiApiBaseUrl } from "@/lib/api/solai-server";

const DRAFT_COOKIE = "solai_draft_token";

async function proxyGeneration(path: string, request: Request): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get(DRAFT_COOKIE)?.value;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.text();
  const upstream = await fetch(`${getSolaiApiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Solai-Draft-Token": token,
      Cookie: `${DRAFT_COOKIE}=${token}`,
    },
    body,
  });

  // Stream SSE through unchanged.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function POST(request: Request) {
  return proxyGeneration("/v1/generation/analyse", request);
}
