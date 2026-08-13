import { cookies } from "next/headers";
import { getSolaiApiBaseUrl } from "@/lib/api/solai-server";

const DRAFT_COOKIE = "solai_draft_token";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(DRAFT_COOKIE)?.value;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.text();
  const upstream = await fetch(`${getSolaiApiBaseUrl()}/v1/generation/rewrite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Solai-Draft-Token": token,
      Cookie: `${DRAFT_COOKIE}=${token}`,
    },
    body,
  });
  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
