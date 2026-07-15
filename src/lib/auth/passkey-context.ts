import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const PASSKEY_CONTEXT_TTL_MS = 10 * 60 * 1000;

function getPasskeySecret() {
  return process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-in-production";
}

export function createPasskeyContextToken(payload: {
  email: string;
  name: string;
}) {
  const exp = Date.now() + PASSKEY_CONTEXT_TTL_MS;
  const body = Buffer.from(
    JSON.stringify({ email: payload.email, name: payload.name, exp }),
  ).toString("base64url");
  const sig = createHmac("sha256", getPasskeySecret())
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

export function verifyPasskeyContextToken(context: string | null | undefined) {
  if (!context) return null;
  const [body, sig] = context.split(".");
  if (!body || !sig) return null;

  const expected = createHmac("sha256", getPasskeySecret())
    .update(body)
    .digest("base64url");

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (
    sigBuf.length !== expectedBuf.length ||
    !timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as { email: string; name: string; exp: number };

    if (!parsed.email || !parsed.name || Date.now() > parsed.exp) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function resolvePasskeyRegistrationUser(context?: string | null) {
  const payload = verifyPasskeyContextToken(context);
  if (!payload) {
    throw new Error("Invalid passkey registration context");
  }

  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, payload.email))
    .limit(1);

  if (existing[0]) {
    return { id: existing[0].id, name: existing[0].name };
  }

  const id = randomUUID();
  await db.insert(user).values({
    id,
    name: payload.name,
    email: payload.email,
    emailVerified: false,
    role: "owner",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id, name: payload.name };
}
