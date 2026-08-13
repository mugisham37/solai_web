import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { proxyDraftRequest } from "@/lib/api/solai-server";

const DRAFT_COOKIE = "solai_draft_token";

export async function POST(
  request: Request,
  context: { params: Promise<{ draftId: string }> },
) {
  const { draftId } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(DRAFT_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await request.text();
  const upstream = await proxyDraftRequest(`/v1/draft/${draftId}/upload-url`, {
    method: "POST",
    draftToken: token,
    headers: { "Content-Type": "application/json" },
    body: payload || "{}",
  });
  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
