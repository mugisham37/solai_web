import { describe, expect, it } from "vitest";
import * as authService from "@/lib/api/services/auth";
import * as sessionsService from "@/lib/api/services/sessions";
import * as usersService from "@/lib/api/services/users";
import { uniqueEmail } from "./support/config";

const STRONG_PASSWORD = "Correct-Horse-99!";
const NEW_PASSWORD = "Second-Strong-Horse-11!";

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

describe("sessions", () => {
  it("lists the active session and flags it current", async () => {
    await registerUser("sessions-list");
    const sessions = await sessionsService.listSessions();
    expect(sessions.length).toBeGreaterThan(0);
    expect(sessions.some((s) => s.is_current)).toBe(true);
  });

  it("revokes a specific session by id", async () => {
    await registerUser("sessions-revoke");
    const [session] = await sessionsService.listSessions();
    await expect(sessionsService.revokeSession(session.id)).resolves.toBeUndefined();
  });

  it("logout revokes the refresh session — a later silent refresh fails", async () => {
    await registerUser("logout");
    await authService.logout();
    // logout() clears the in-memory access token locally; the meaningful
    // server-side assertion is that the now-cleared refresh cookie can no
    // longer mint a new access token.
    const refreshed = await authService.refresh();
    expect(refreshed).toBeNull();
  });

  it("logout-all revokes every session, including the current one", async () => {
    await registerUser("logout-all");
    await authService.logoutAll();
    const refreshed = await authService.refresh();
    expect(refreshed).toBeNull();
  });
});

describe("profile and password", () => {
  it("reads and updates the profile via the real endpoint", async () => {
    await registerUser("profile-update");
    const profile = await usersService.getProfile();
    expect(profile.full_name).toContain("QA profile-update");

    const updated = await usersService.updateProfile({ full_name: "Renamed QA User" });
    expect(updated.full_name).toBe("Renamed QA User");
  });

  it("rejects a password change with the wrong current password", async () => {
    await registerUser("password-change-wrong");
    await expect(
      usersService.changePassword({
        current_password: "not-the-real-password",
        new_password: NEW_PASSWORD,
      }),
    ).rejects.toMatchObject({ code: "auth.invalid_password" });
  });

  it("changes the password and the new one works on next login", async () => {
    const email = await registerUser("password-change");
    await usersService.changePassword({
      current_password: STRONG_PASSWORD,
      new_password: NEW_PASSWORD,
    });

    await expect(
      authService.login({ email, password: STRONG_PASSWORD }),
    ).rejects.toMatchObject({ code: "auth.invalid_credentials" });

    const response = await authService.login({ email, password: NEW_PASSWORD });
    expect("access_token" in response).toBe(true);
  });
});
