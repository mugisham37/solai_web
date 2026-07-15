export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") return fallback;

  const err = error as {
    message?: string;
    code?: string;
    status?: number;
  };

  switch (err.code) {
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "An account with this email already exists.";
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Email or password is incorrect.";
    case "EMAIL_NOT_VERIFIED":
      return "Please verify your email before signing in.";
    case "INVALID_OTP":
    case "OTP_EXPIRED":
      return "Verification code is invalid or expired.";
    case "TOO_MANY_ATTEMPTS":
    case "ACCOUNT_TEMPORARILY_LOCKED":
      return err.message ?? "Too many attempts. Try again later.";
    case "INVALID_TOKEN":
      return "This link is invalid or has expired.";
    case "PASSWORD_TOO_WEAK":
      return "Choose a stronger password.";
    default:
      return err.message || fallback;
  }
}

export function getLockoutSeconds(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const message = (error as { message?: string }).message ?? "";
  const match = message.match(/(\d+)\s*seconds?/i);
  return match ? Number(match[1]) : null;
}
