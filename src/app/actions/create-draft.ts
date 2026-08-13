"use server";

import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { createDraftOnServer } from "@/lib/api/solai-server";

const DRAFT_COOKIE = "solai_draft_token";
const DRAFT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

async function mintDraftAndRedirect(description: string) {
  const { draftId, draftToken } = await createDraftOnServer(
    description || undefined,
  );
  const cookieStore = await cookies();
  cookieStore.set(DRAFT_COOKIE, draftToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: DRAFT_COOKIE_MAX_AGE,
  });
  const locale = await getLocale();
  const params = new URLSearchParams();
  if (description) params.set("q", description);
  params.set("screen", "capture");
  const qs = params.toString();
  redirect({
    href: `/build/${draftId}${qs ? `?${qs}` : ""}`,
    locale,
  });
}

export async function createDraftAndRedirect(formData: FormData) {
  const q = formData.get("q");
  const description = typeof q === "string" ? q.trim() : "";
  await mintDraftAndRedirect(description);
}

export async function createDraftFromQuery(query?: string) {
  await mintDraftAndRedirect(query?.trim() ?? "");
}
