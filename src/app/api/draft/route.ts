import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createMockDraft } from "@/lib/generation/mock";
import { saveDraftMemory, getDraftMemory } from "@/lib/draft-store";

const DRAFT_COOKIE = "solai_draft_token";

export async function POST() {
  const draftId = nanoid();
  const token = nanoid();
  const placeholder = "data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'/>");
  const draft = createMockDraft(draftId, placeholder);
  saveDraftMemory(draft);

  const res = NextResponse.json({ draftId });
  res.cookies.set(DRAFT_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("draftId");
  if (!draftId) {
    return NextResponse.json({ error: "Missing draftId" }, { status: 400 });
  }
  const draft = getDraftMemory(draftId);
  if (!draft) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ draft });
}
