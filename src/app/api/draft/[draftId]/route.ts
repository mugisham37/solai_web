import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { proxyDraftRequest } from "@/lib/api/solai-server";

const DRAFT_COOKIE = "solai_draft_token";

async function draftToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(DRAFT_COOKIE)?.value;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ draftId: string }> },
) {
  const { draftId } = await context.params;
  const token = await draftToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const upstream = await proxyDraftRequest(`/v1/draft/${draftId}`, {
    method: "GET",
    draftToken: token,
  });
  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ draftId: string }> },
) {
  const { draftId } = await context.params;
  const token = await draftToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await request.text();
  const upstream = await proxyDraftRequest(`/v1/draft/${draftId}`, {
    method: "PUT",
    draftToken: token,
    headers: { "Content-Type": "application/json" },
    body: payload,
  });
  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
