type SmsPayload = {
  to: string;
  body: string;
  meta?: Record<string, string>;
};

/**
 * Console-log stub for SMS delivery.
 * Swap-in point: Twilio (default) or Africa's Talking (regional alternative).
 */
export async function sendSms(payload: SmsPayload): Promise<void> {
  console.log("[sms:stub]", {
    to: payload.to,
    body: payload.body,
    meta: payload.meta,
  });
}

export async function sendTwoFactorSms(
  phoneNumber: string,
  otp: string,
): Promise<void> {
  await sendSms({
    to: phoneNumber,
    body: `Your SolAI verification code is: ${otp}`,
    meta: { type: "two-factor-otp" },
  });
}
