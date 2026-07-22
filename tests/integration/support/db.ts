import { Client } from "pg";
import { DATABASE_URL } from "./config";

/**
 * Mirrors the pattern the backend's own pytest suite uses (see
 * solai_server/tests/api/test_2fa.py, tests/services/test_tokens.py):
 * codes/tokens the API never returns in JSON are read back from the
 * outbox_messages table it queued them into, rather than parsed out of an
 * email inbox or scraped from logs.
 */
async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

async function latestBodyFor(
  channel: "email" | "sms",
  to: string,
): Promise<string> {
  return withClient(async (client) => {
    const { rows } = await client.query<{ body: string }>(
      `select payload->>'body' as body
       from outbox_messages
       where channel = $1 and payload->>'to' = $2
       order by created_at desc
       limit 1`,
      [channel, to],
    );
    if (rows.length === 0) {
      throw new Error(`No ${channel} outbox message found for ${to}`);
    }
    return rows[0].body;
  });
}

export async function fetchLatestEmailCode(to: string): Promise<string> {
  const body = await latestBodyFor("email", to);
  const match = body.match(/\b(\d{6})\b/);
  if (!match) throw new Error(`No 6-digit code found in email body for ${to}`);
  return match[1];
}

export async function fetchLatestSmsCode(to: string): Promise<string> {
  const body = await latestBodyFor("sms", to);
  const match = body.match(/\b(\d{6})\b/);
  if (!match) throw new Error(`No 6-digit code found in SMS body for ${to}`);
  return match[1];
}

export async function fetchLatestResetToken(to: string): Promise<string> {
  const body = await latestBodyFor("email", to);
  const match = body.match(/token=(\S+)/);
  if (!match) throw new Error(`No reset token found in email body for ${to}`);
  return match[1];
}
