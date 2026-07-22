/**
 * API contract types. Backend-originated shapes are aliased directly from
 * `generated.ts` (produced by `npm run generate:api` against the live
 * backend's OpenAPI schema) so the two systems cannot silently drift.
 * Only genuinely frontend-only shapes below are hand-authored.
 */
import type { components } from "./generated";

// `ErrorResponse` is built ad hoc by the backend's exception handler rather
// than declared as a route response_model, so it never appears in the
// generated OpenAPI schema — this one has to stay hand-authored, kept in
// sync with `app/schemas/common.py::ErrorResponse`.
export interface ErrorResponse {
  detail: string;
  code: string;
  retry_after?: number | null;
}

export type MessageResponse = components["schemas"]["MessageResponse"];
export type UserProfileResponse =
  components["schemas"]["UserProfileResponse"];
export type WorkspaceResponse = components["schemas"]["WorkspaceResponse"];
export type SessionResponse = components["schemas"]["SessionResponse"];
export type TwoFactorRequiredResponse =
  components["schemas"]["TwoFactorRequiredResponse"];

export type LoginResponse = SessionResponse | TwoFactorRequiredResponse;

export function isMfaRequired(
  response: LoginResponse,
): response is TwoFactorRequiredResponse {
  return "status" in response && response.status === "mfa_required";
}

export type ActiveSessionResponse =
  components["schemas"]["ActiveSessionResponse"];
export type TotpInitResponse = components["schemas"]["TotpInitResponse"];
export type RecoveryCodesResponse =
  components["schemas"]["RecoveryCodesResponse"];

// Backend calls this `TwoFactorMethodResponse`; kept under the frontend's
// existing name so no call sites need to change.
export type TwoFactorMethodStatus =
  components["schemas"]["TwoFactorMethodResponse"];

export type TwoFactorStatusResponse =
  components["schemas"]["TwoFactorStatusResponse"];
export type AuditEventResponse = components["schemas"]["AuditEventResponse"];
export type PaginatedAuditResponse =
  components["schemas"]["PaginatedAuditResponse"];
export type RegisterRequest = components["schemas"]["RegisterRequest"];
export type LoginRequest = components["schemas"]["LoginRequest"];
export type EmailVerifyRequest =
  components["schemas"]["EmailVerifyRequest"];
export type ForgotPasswordRequest =
  components["schemas"]["ForgotPasswordRequest"];
export type ResetPasswordRequest =
  components["schemas"]["ResetPasswordRequest"];
export type PasswordChangeRequest =
  components["schemas"]["PasswordChangeRequest"];
export type UserProfileUpdateRequest =
  components["schemas"]["UserProfileUpdateRequest"];
export type TotpConfirmRequest =
  components["schemas"]["TotpConfirmRequest"];
export type SmsInitRequest = components["schemas"]["SmsInitRequest"];
export type SmsConfirmRequest = components["schemas"]["SmsConfirmRequest"];
export type RecoveryRegenerateRequest =
  components["schemas"]["RecoveryRegenerateRequest"];
export type ChallengeTotpRequest =
  components["schemas"]["ChallengeTotpRequest"];
export type ChallengeSmsSendRequest =
  components["schemas"]["ChallengeSmsSendRequest"];
export type ChallengeSmsVerifyRequest =
  components["schemas"]["ChallengeSmsVerifyRequest"];
export type ChallengeRecoveryRequest =
  components["schemas"]["ChallengeRecoveryRequest"];

export interface TwoFactorChallengeState {
  challengeToken: string;
  methods: string[];
}

export const CHALLENGE_STORAGE_KEY = "solai_2fa_challenge";

export function storeChallenge(state: TwoFactorChallengeState): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(state));
}

export function loadChallenge(): TwoFactorChallengeState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TwoFactorChallengeState;
  } catch {
    return null;
  }
}

export function clearChallenge(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHALLENGE_STORAGE_KEY);
}
