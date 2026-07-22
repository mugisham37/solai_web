import { describe, expect, it } from "vitest";
import * as authService from "@/lib/api/services/auth";
import * as twoFactorService from "@/lib/api/services/twoFactor";
import { uniqueEmail } from "./support/config";
import { generateTotpCode } from "./support/totp";

const STRONG_PASSWORD = "Correct-Horse-99!";

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

describe("2FA management", () => {
  it("sets up TOTP end to end with a real secret and code, and returns real recovery codes", async () => {
    await registerUser("totp-setup");
    const init = await twoFactorService.initTotp();
    expect(init.secret).toBeTruthy();
    expect(init.provisioning_uri).toContain(init.secret);

    const result = await twoFactorService.confirmTotp({
      code: generateTotpCode(init.secret),
    });
    expect(result.recovery_codes.length).toBeGreaterThan(0);
  });

  it("rejects TOTP confirmation with a fabricated code", async () => {
    await registerUser("totp-bad-confirm");
    await twoFactorService.initTotp();
    await expect(
      twoFactorService.confirmTotp({ code: "000000" }),
    ).rejects.toMatchObject({ code: "auth.invalid_code" });
  });

  it("reflects active methods in the status endpoint after setup", async () => {
    await registerUser("status");
    const init = await twoFactorService.initTotp();
    await twoFactorService.confirmTotp({ code: generateTotpCode(init.secret) });

    const status = await twoFactorService.getTwoFactorStatus();
    expect(status.methods.some((m) => m.method_type === "totp")).toBe(true);
    expect(status.unused_recovery_codes).toBeGreaterThan(0);
  });

  it("requires the current password to regenerate recovery codes, and rejects a wrong one", async () => {
    await registerUser("recovery-regen");
    const init = await twoFactorService.initTotp();
    await twoFactorService.confirmTotp({ code: generateTotpCode(init.secret) });

    await expect(
      twoFactorService.regenerateRecoveryCodes({ password: "wrong-password" }),
    ).rejects.toMatchObject({ code: "auth.invalid_password" });

    const result = await twoFactorService.regenerateRecoveryCodes({
      password: STRONG_PASSWORD,
    });
    expect(result.recovery_codes.length).toBeGreaterThan(0);
  });

  it("disables a method via the delete endpoint, removing it from status", async () => {
    await registerUser("disable-method");
    const init = await twoFactorService.initTotp();
    await twoFactorService.confirmTotp({ code: generateTotpCode(init.secret) });

    const before = await twoFactorService.getTwoFactorStatus();
    const totpMethod = before.methods.find((m) => m.method_type === "totp");
    expect(totpMethod).toBeDefined();

    await twoFactorService.disableTwoFactorMethod(totpMethod!.id);

    const after = await twoFactorService.getTwoFactorStatus();
    expect(after.methods.some((m) => m.method_type === "totp")).toBe(false);
  });
});
