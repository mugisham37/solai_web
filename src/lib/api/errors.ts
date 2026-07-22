import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/lib/api/types";

export class ApiError extends Error {
  code: string;
  status: number;
  retryAfter: number | null;

  constructor(
    message: string,
    code: string,
    status: number,
    retryAfter: number | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  "auth.unauthenticated": "Please sign in to continue.",
  "auth.invalid_credentials": "Invalid email or password.",
  "auth.account_locked": "Account temporarily locked. Try again later.",
  "auth.email_taken": "This email is already registered.",
  "auth.terms_required": "You must accept the Terms of Service.",
  "auth.weak_password": "Choose a stronger password.",
  "auth.rate_limited": "Too many attempts. Please wait and try again.",
  "auth.refresh_missing": "Your session has expired. Please sign in again.",
  "auth.invalid_refresh": "Your session has expired. Please sign in again.",
  "auth.refresh_expired": "Your session has expired. Please sign in again.",
  "auth.session_reuse": "Your session was revoked for security. Please sign in again.",
  "auth.challenge_expired": "This verification step expired. Please sign in again.",
  "auth.challenge_attempts_exceeded": "Too many verification attempts. Please sign in again.",
  "auth.invalid_code": "Invalid code. Please try again.",
  "auth.code_expired": "This code has expired. Request a new one.",
  "auth.code_attempts_exceeded": "Too many attempts on this code. Request a new one.",
  "auth.invalid_recovery_code": "Invalid recovery code.",
  "auth.reset_invalid": "This reset link is invalid or has expired.",
  "auth.invalid_password": "Current password is incorrect.",
  "auth.sms_daily_limit": "Daily SMS limit reached. Try again later.",
  "auth.2fa_not_started": "Two-factor setup was not started.",
  "auth.2fa_not_configured": "Two-factor method is not configured.",
  "auth.sms_not_configured": "SMS backup is not configured.",
  "auth.2fa_not_found": "Two-factor method not found.",
};

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  const axiosError = error as AxiosError<ErrorResponse>;
  const data = axiosError.response?.data;
  const status = axiosError.response?.status ?? 500;
  const code = data?.code ?? "unknown.error";
  const retryAfter =
    data?.retry_after ??
    (axiosError.response?.headers?.["retry-after"]
      ? Number(axiosError.response.headers["retry-after"])
      : null);

  const mapped = ERROR_MESSAGES[code];
  const detail = data?.detail ?? axiosError.message ?? "Something went wrong.";
  const message = mapped ?? detail;

  return new ApiError(message, code, status, retryAfter);
}

export function formatRetryMessage(error: ApiError): string {
  if (error.retryAfter && error.retryAfter > 0) {
    const minutes = Math.ceil(error.retryAfter / 60);
    if (minutes > 1) {
      return `${error.message} Try again in about ${minutes} minutes.`;
    }
    return `${error.message} Try again in ${error.retryAfter} seconds.`;
  }
  return error.message;
}
