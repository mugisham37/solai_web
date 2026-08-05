import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(
  request: Request,
  context: { params: Promise<{ draftId: string }> },
) {
  await context.params;
  const body = (await request.json()) as { fileName?: string };
  const fileName = body.fileName ?? "upload.jpg";
  const id = nanoid(8);
  return NextResponse.json({
    uploadUrl: `mock://${id}`,
    publicUrl: `mock://upload/${encodeURIComponent(fileName)}`,
  });
}
