type EmailPayload = {
  to: string;
  subject: string;
  body: string;
  meta?: Record<string, string>;
};

/**
 * Console-log stub for transactional email.
 * Swap-in point: Resend (recommended for Next.js transactional email).
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  console.log("[email:stub]", {
    to: payload.to,
    subject: payload.subject,
    body: payload.body,
    meta: payload.meta,
  });
}

export async function sendVerificationCodeEmail(
  email: string,
  otp: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Verify your SolAI email",
    body: `Your verification code is: ${otp}`,
    meta: { type: "email-verification" },
  });
}

export async function sendMagicLinkEmail(
  email: string,
  url: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Sign in to SolAI",
    body: `Click to sign in: ${url}`,
    meta: { type: "magic-link" },
  });
}

export async function sendPasswordResetEmail(
  email: string,
  url: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Reset your SolAI password",
    body: `Reset your password: ${url}`,
    meta: { type: "password-reset" },
  });
}
