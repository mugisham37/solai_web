import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createDraftOnServer, proxyDraftRequest } from "@/lib/api/solai-server";

const DRAFT_COOKIE = "solai_draft_token";
const DRAFT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST() {
  try {
    const { draftId, draftToken } = await createDraftOnServer();
    const res = NextResponse.json({ draftId });
    res.cookies.set(DRAFT_COOKIE, draftToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: DRAFT_COOKIE_MAX_AGE,
    });
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("draftId");
  if (!draftId) {
    return NextResponse.json({ error: "Missing draftId" }, { status: 400 });
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(DRAFT_COOKIE)?.value;
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
