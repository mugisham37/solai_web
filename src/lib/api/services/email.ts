import { apiClient } from "@/lib/api/client";
import type { EmailVerifyRequest, MessageResponse } from "@/lib/api/types";

export async function sendVerificationCode(): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/auth/email/send-code");
  return data;
}

export async function verifyEmail(body: EmailVerifyRequest): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    "/auth/email/verify",
    body,
  );
  return data;
}
