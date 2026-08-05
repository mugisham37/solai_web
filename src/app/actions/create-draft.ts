"use server";

import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export async function createDraftAndRedirect(formData: FormData) {
  const q = formData.get("q");
  const description = typeof q === "string" ? q.trim() : "";
  const draftId = nanoid();
  const token = nanoid();
  const cookieStore = await cookies();
  cookieStore.set("solai_draft_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
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

export async function createDraftFromQuery(query?: string) {
  const draftId = nanoid();
  const token = nanoid();
  const cookieStore = await cookies();
  cookieStore.set("solai_draft_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  const locale = await getLocale();
  const params = new URLSearchParams();
  if (query?.trim()) params.set("q", query.trim());
  params.set("screen", "capture");
  const qs = params.toString();
  redirect({
    href: `/build/${draftId}${qs ? `?${qs}` : ""}`,
    locale,
  });
}
