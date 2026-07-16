export function simulateAuthDelay(ms = 700): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return out;
}

export function generateFakeBackupCodes(count = 8): string[] {
  return Array.from({ length: count }, () => `${randomSegment(4)}-${randomSegment(4)}`);
}

export function generateFakeTotpSecret(): string {
  return randomSegment(16);
}

export function generateFakeTotpUri(email: string, secret: string): string {
  return `otpauth://totp/SolAI:${encodeURIComponent(email)}?secret=${secret}&issuer=SolAI`;
}
