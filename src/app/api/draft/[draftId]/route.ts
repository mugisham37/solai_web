import { NextResponse } from "next/server";
import { draftSchema } from "@/lib/schemas/build";
import type { Draft } from "@/types/build";
import { getDraftMemory, saveDraftMemory } from "@/lib/draft-store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ draftId: string }> },
) {
  const { draftId } = await context.params;
  const draft = getDraftMemory(draftId);
  if (!draft) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ draft });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ draftId: string }> },
) {
  const { draftId } = await context.params;
  const body = (await request.json()) as { draft: unknown };
  const parsed = draftSchema.safeParse(body.draft);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid draft" }, { status: 400 });
  }
  if (parsed.data.id !== draftId) {
    return NextResponse.json({ error: "ID mismatch" }, { status: 400 });
  }
  if (parsed.data.images.original.locked !== true) {
    return NextResponse.json({ error: "Original must stay locked" }, { status: 400 });
  }
  saveDraftMemory(parsed.data as Draft);
  return NextResponse.json({ ok: true });
}
