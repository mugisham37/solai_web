import { describe, expect, it } from "vitest";
import { ApiError, formatRetryMessage, parseApiError } from "@/lib/api/errors";

describe("parseApiError", () => {
  it("maps known auth codes to stable user-facing copy", () => {
    const parsed = parseApiError({
      response: {
        status: 401,
        data: {
          detail: "Invalid email or password.",
          code: "auth.invalid_credentials",
        },
      },
      message: "Request failed",
    });
    expect(parsed.message).toBe("Invalid email or password.");
  });

  it("includes retry-after guidance when present", () => {
    const error = new ApiError("locked", "auth.account_locked", 429, 45);
    expect(formatRetryMessage(error)).toContain("45 seconds");
  });

  it("falls back to backend detail for unknown codes", () => {
    const axiosLike = {
      response: {
        status: 422,
        data: {
          detail: "Custom backend detail",
          code: "custom.code",
        },
      },
      message: "Request failed",
    };
    const parsed = parseApiError(axiosLike);
    expect(parsed.message).toBe("Custom backend detail");
    expect(parsed.code).toBe("custom.code");
  });
});

describe("mapAuditEvent", () => {
  it("maps backend audit payloads into UI events", async () => {
    const { mapAuditEvent } = await import("@/lib/api/mappers/audit");
    const mapped = mapAuditEvent({
      id: "00000000-0000-0000-0000-000000000001",
      action: "auth.login.success",
      tone: "success",
      actor_type: "human",
      metadata: { actor_email: "user@example.com" },
      created_at: "2026-07-22T10:00:00.000Z",
    });

    expect(mapped.who).toBe("user@example.com");
    expect(mapped.action).toBe("auth.login.success");
    expect(mapped.actor).toBe("human");
  });
});
