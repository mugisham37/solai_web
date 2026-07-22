import { describe, expect, it } from "vitest";
import * as authService from "@/lib/api/services/auth";
import * as emailService from "@/lib/api/services/email";
import { ApiError } from "@/lib/api/errors";
import { uniqueEmail } from "./support/config";
import { fetchLatestEmailCode } from "./support/db";

const STRONG_PASSWORD = "Correct-Horse-99!";

async function registerUnverified(label: string) {
  const email = uniqueEmail(label);
  await authService.register({
    name: `QA ${label}`,
    email,
    password: STRONG_PASSWORD,
    terms_accepted: true,
    marketing_opt_in: false,
  });
  // Registration does not send a verification code on its own — the
  // frontend's verify-email screen requests one on mount.
  await emailService.sendVerificationCode();
  return email;
}

describe("email verification", () => {
  it("verifies a signed-up user with the real emailed code", async () => {
    const email = await registerUnverified("verify");
    const code = await fetchLatestEmailCode(email);
    const result = await emailService.verifyEmail({ code });
    expect(result.message).toBeTruthy();
  });

  it("rejects a wrong code with auth.invalid_code", async () => {
    await registerUnverified("wrong-code");
    await expect(emailService.verifyEmail({ code: "000000" })).rejects.toMatchObject({
      code: "auth.invalid_code",
    });
  });

  it("locks the code out after 5 wrong attempts, then requires a fresh one", async () => {
    await registerUnverified("code-exceeded");

    for (let i = 0; i < 5; i++) {
      await expect(emailService.verifyEmail({ code: "000000" })).rejects.toMatchObject({
        code: "auth.invalid_code",
      });
    }

    await expect(emailService.verifyEmail({ code: "000000" })).rejects.toSatisfy(
      (error: unknown) => {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).code).toBe("auth.code_attempts_exceeded");
        return true;
      },
    );
  });
});
