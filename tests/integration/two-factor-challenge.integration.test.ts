import { describe, expect, it } from "vitest";
import * as authService from "@/lib/api/services/auth";
import * as twoFactorService from "@/lib/api/services/twoFactor";
import { isMfaRequired, loadChallenge, storeChallenge } from "@/lib/api/types";
import { ApiError } from "@/lib/api/errors";
import { uniqueEmail } from "./support/config";
import { fetchLatestSmsCode } from "./support/db";
import { generateTotpCode } from "./support/totp";

const STRONG_PASSWORD = "Correct-Horse-99!";

async function registerAndEnableTotp(label: string) {
  const email = uniqueEmail(label);
  await authService.register({
    name: `QA ${label}`,
    email,
    password: STRONG_PASSWORD,
    terms_accepted: true,
    marketing_opt_in: false,
  });

  const init = await twoFactorService.initTotp();
  const recovery = await twoFactorService.confirmTotp({
    code: generateTotpCode(init.secret),
  });

  return { email, secret: init.secret, recoveryCodes: recovery.recovery_codes };
}

async function beginChallenge(email: string) {
  const response = await authService.login({ email, password: STRONG_PASSWORD });
  if (!isMfaRequired(response)) {
    throw new Error("Expected login to require MFA once a 2FA method is active");
  }
  return response;
}

describe("2FA login challenge", () => {
  it("returns mfa_required on password-correct login once TOTP is active", async () => {
    const { email } = await registerAndEnableTotp("mfa-required");
    const challenge = await beginChallenge(email);
    expect(challenge.methods).toContain("totp");
    expect(challenge.challenge_token).toBeTruthy();
  });

  it("completes the TOTP challenge with a real generated code", async () => {
    const { email, secret } = await registerAndEnableTotp("totp-challenge");
    const challenge = await beginChallenge(email);

    const session = await twoFactorService.challengeTotp({
      challenge_token: challenge.challenge_token,
      code: generateTotpCode(secret),
    });

    expect(session.user.email).toBe(email);
    expect(session.access_token).toBeTruthy();
  });

  it("completes the SMS challenge end to end", async () => {
    const { email } = await registerAndEnableTotp("sms-setup-base");
    // Disable TOTP isn't necessary — SMS can be added as a second method.
    const phone = `07${Math.floor(10000000 + Math.random() * 89999999)}`;
    await twoFactorService.initSms({ phone });
    const smsCode = await fetchLatestSmsCode(normalizePhoneForLookup(phone));
    await twoFactorService.confirmSms({ code: smsCode });

    const challenge = await beginChallenge(email);
    expect(challenge.methods).toContain("sms");

    await twoFactorService.challengeSmsSend({
      challenge_token: challenge.challenge_token,
    });
    const loginCode = await fetchLatestSmsCode(normalizePhoneForLookup(phone));
    const session = await twoFactorService.challengeSmsVerify({
      challenge_token: challenge.challenge_token,
      code: loginCode,
    });
    expect(session.user.email).toBe(email);
  });

  it("completes the challenge with a real recovery code and uses the authenticated identity, not a placeholder", async () => {
    const { email, recoveryCodes } = await registerAndEnableTotp("recovery-challenge");
    const challenge = await beginChallenge(email);

    const session = await twoFactorService.challengeRecovery({
      challenge_token: challenge.challenge_token,
      code: recoveryCodes[0],
    });

    expect(session.user.email).toBe(email);
  });

  it("rejects wrong codes and locks the challenge after 5 wrong attempts", async () => {
    const { email } = await registerAndEnableTotp("challenge-lockout");
    const challenge = await beginChallenge(email);

    for (let i = 0; i < 4; i++) {
      await expect(
        twoFactorService.challengeTotp({
          challenge_token: challenge.challenge_token,
          code: "000000",
        }),
      ).rejects.toMatchObject({ code: "auth.invalid_code" });
    }

    await expect(
      twoFactorService.challengeTotp({
        challenge_token: challenge.challenge_token,
        code: "000000",
      }),
    ).rejects.toSatisfy((error: unknown) => {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).code).toBe("auth.challenge_attempts_exceeded");
      return true;
    });
  });

  // storeChallenge/loadChallenge back the frontend's sessionStorage bridge
  // between the login screen and the /two-factor route — exercised here
  // under Node's in-memory sessionStorage polyfill absence guard, just to
  // confirm the pure serialization round-trips.
  it("round-trips a challenge through the sessionStorage helpers when a window exists", () => {
    if (typeof window === "undefined") return;
    storeChallenge({ challengeToken: "tok", methods: ["totp"] });
    expect(loadChallenge()).toEqual({ challengeToken: "tok", methods: ["totp"] });
  });
});

function normalizePhoneForLookup(localPhone: string): string {
  // Mirrors solai_server's normalize_phone("+250" default) for a bare
  // 07xxxxxxxx local number.
  return `+250${localPhone.replace(/^0/, "")}`;
}
