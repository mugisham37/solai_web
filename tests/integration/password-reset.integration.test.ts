import { describe, expect, it } from "vitest";
import * as authService from "@/lib/api/services/auth";
import { uniqueEmail } from "./support/config";
import { fetchLatestResetToken } from "./support/db";

const STRONG_PASSWORD = "Correct-Horse-99!";
const NEW_PASSWORD = "Even-Stronger-Horse-42!";

async function registerUser(label: string) {
  const email = uniqueEmail(label);
  await authService.register({
    name: `QA ${label}`,
    email,
    password: STRONG_PASSWORD,
    terms_accepted: true,
    marketing_opt_in: false,
  });
  return email;
}

describe("password reset", () => {
  it("requests, completes with the real emailed token, and the new password works", async () => {
    const email = await registerUser("reset-flow");
    await authService.forgotPassword({ email });
    const token = await fetchLatestResetToken(email);

    const result = await authService.resetPassword({ token, password: NEW_PASSWORD });
    expect(result.message).toBeTruthy();

    await expect(
      authService.login({ email, password: STRONG_PASSWORD }),
    ).rejects.toMatchObject({ code: "auth.invalid_credentials" });

    const response = await authService.login({ email, password: NEW_PASSWORD });
    expect("access_token" in response).toBe(true);
  });

  it("rejects reusing an already-consumed token", async () => {
    const email = await registerUser("reset-single-use");
    await authService.forgotPassword({ email });
    const token = await fetchLatestResetToken(email);

    await authService.resetPassword({ token, password: NEW_PASSWORD });

    await expect(
      authService.resetPassword({ token, password: "Another-Strong-One-7!" }),
    ).rejects.toMatchObject({ code: "auth.reset_invalid" });
  });

  it("responds identically whether or not the email is registered (enumeration-safe)", async () => {
    const registered = await registerUser("reset-enum-known");
    const unknown = uniqueEmail("reset-enum-unknown");

    const known = await authService.forgotPassword({ email: registered });
    const notKnown = await authService.forgotPassword({ email: unknown });

    expect(known.message).toBe(notKnown.message);
  });
});
