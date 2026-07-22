import { TOTP } from "otpauth";

/**
 * Backend generates secrets via pyotp.random_base32() and verifies with
 * pyotp's defaults (SHA1, 6 digits, 30s step) — see
 * solai_server/app/core/security.py::generate_totp_secret/verify_totp_code.
 */
export function generateTotpCode(secret: string): string {
  const totp = new TOTP({ secret, digits: 6, period: 30, algorithm: "SHA1" });
  return totp.generate();
}
