import { cookies } from "next/headers";

export const PENDING_EMAIL_COOKIE = "solai_pending_email";
export const PENDING_EMAIL_MAX_AGE = 60 * 30; // 30 minutes

export async function setPendingEmailCookie(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(PENDING_EMAIL_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: PENDING_EMAIL_MAX_AGE,
    path: "/",
  });
}

export async function getPendingEmailCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(PENDING_EMAIL_COOKIE)?.value ?? null;
}

export async function clearPendingEmailCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_EMAIL_COOKIE);
}
