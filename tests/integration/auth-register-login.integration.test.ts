import { describe, expect, it } from "vitest";
import * as authService from "@/lib/api/services/auth";
import { isMfaRequired } from "@/lib/api/types";
import { ApiError } from "@/lib/api/errors";
import { uniqueEmail } from "./support/config";

const STRONG_PASSWORD = "Correct-Horse-99!";

describe("register + login", () => {
  it("registers and returns a real session with user + workspace", async () => {
    const email = uniqueEmail("register");
    const session = await authService.register({
      name: "QA Register",
      email,
      password: STRONG_PASSWORD,
      terms_accepted: true,
      marketing_opt_in: false,
    });

    expect(session.access_token).toBeTruthy();
    expect(session.user.email).toBe(email);
    expect(session.user.email_verified).toBe(false);
    expect(session.user.onboarding_completed).toBe(false);
    expect(session.workspace.name).toContain("QA Register");
  });

  it("rejects a duplicate email with auth.email_taken", async () => {
    const email = uniqueEmail("dup");
    await authService.register({
      name: "QA Dup",
      email,
      password: STRONG_PASSWORD,
      terms_accepted: true,
      marketing_opt_in: false,
    });

    await expect(
      authService.register({
        name: "QA Dup Again",
        email,
        password: STRONG_PASSWORD,
        terms_accepted: true,
        marketing_opt_in: false,
      }),
    ).rejects.toMatchObject({ code: "auth.email_taken" } satisfies Partial<ApiError>);
  });

  it("rejects a weak password with auth.weak_password", async () => {
    await expect(
      authService.register({
        name: "QA Weak",
        email: uniqueEmail("weak"),
        password: "password",
        terms_accepted: true,
        marketing_opt_in: false,
      }),
    ).rejects.toMatchObject({ code: "auth.weak_password" });
  });

  it("logs in with correct credentials and returns a session", async () => {
    const email = uniqueEmail("login");
    await authService.register({
      name: "QA Login",
      email,
      password: STRONG_PASSWORD,
      terms_accepted: true,
      marketing_opt_in: false,
    });

    const response = await authService.login({ email, password: STRONG_PASSWORD });
    expect(isMfaRequired(response)).toBe(false);
    if (!isMfaRequired(response)) {
      expect(response.user.email).toBe(email);
    }
  });

  it("rejects a wrong password with auth.invalid_credentials", async () => {
    const email = uniqueEmail("wrongpw");
    await authService.register({
      name: "QA Wrong Password",
      email,
      password: STRONG_PASSWORD,
      terms_accepted: true,
      marketing_opt_in: false,
    });

    await expect(
      authService.login({ email, password: "definitely-wrong-1" }),
    ).rejects.toMatchObject({ code: "auth.invalid_credentials" });
  });

  it("locks the account after 5 wrong passwords, with a real retry_after", async () => {
    const email = uniqueEmail("lockout");
    await authService.register({
      name: "QA Lockout",
      email,
      password: STRONG_PASSWORD,
      terms_accepted: true,
      marketing_opt_in: false,
    });

    for (let i = 0; i < 5; i++) {
      await expect(
        authService.login({ email, password: "definitely-wrong-1" }),
      ).rejects.toMatchObject({ code: "auth.invalid_credentials" });
    }

    await expect(
      authService.login({ email, password: "definitely-wrong-1" }),
    ).rejects.toSatisfy((error: unknown) => {
      expect(error).toBeInstanceOf(ApiError);
      const apiError = error as ApiError;
      expect(apiError.code).toBe("auth.account_locked");
      expect(apiError.retryAfter).toBeGreaterThan(0);
      return true;
    });
  });
});
