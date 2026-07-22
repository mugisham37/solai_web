import { apiClient, applySession } from "@/lib/api/client";
import type {
  ChallengeRecoveryRequest,
  ChallengeSmsSendRequest,
  ChallengeSmsVerifyRequest,
  ChallengeTotpRequest,
  MessageResponse,
  RecoveryCodesResponse,
  RecoveryRegenerateRequest,
  SessionResponse,
  SmsConfirmRequest,
  SmsInitRequest,
  TotpConfirmRequest,
  TotpInitResponse,
  TwoFactorStatusResponse,
} from "@/lib/api/types";

export async function initTotp(): Promise<TotpInitResponse> {
  const { data } = await apiClient.post<TotpInitResponse>("/auth/2fa/totp/init");
  return data;
}

export async function confirmTotp(body: TotpConfirmRequest): Promise<RecoveryCodesResponse> {
  const { data } = await apiClient.post<RecoveryCodesResponse>(
    "/auth/2fa/totp/confirm",
    body,
  );
  return data;
}

export async function initSms(body: SmsInitRequest): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/auth/2fa/sms/init", body);
  return data;
}

export async function resendSms(body: SmsInitRequest): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/auth/2fa/sms/resend", body);
  return data;
}

export async function confirmSms(body: SmsConfirmRequest): Promise<RecoveryCodesResponse> {
  const { data } = await apiClient.post<RecoveryCodesResponse>(
    "/auth/2fa/sms/confirm",
    body,
  );
  return data;
}

export async function regenerateRecoveryCodes(
  body: RecoveryRegenerateRequest,
): Promise<RecoveryCodesResponse> {
  const { data } = await apiClient.post<RecoveryCodesResponse>(
    "/auth/2fa/recovery-codes/regenerate",
    body,
  );
  return data;
}

export async function getTwoFactorStatus(): Promise<TwoFactorStatusResponse> {
  const { data } = await apiClient.get<TwoFactorStatusResponse>("/auth/2fa/status");
  return data;
}

export async function disableTwoFactorMethod(methodId: string): Promise<void> {
  await apiClient.delete(`/auth/2fa/methods/${methodId}`);
}

export async function challengeTotp(body: ChallengeTotpRequest): Promise<SessionResponse> {
  const { data } = await apiClient.post<SessionResponse>(
    "/auth/2fa/challenge/totp",
    body,
  );
  applySession(data);
  return data;
}

export async function challengeSmsSend(
  body: ChallengeSmsSendRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    "/auth/2fa/challenge/sms/send",
    body,
  );
  return data;
}

export async function challengeSmsVerify(
  body: ChallengeSmsVerifyRequest,
): Promise<SessionResponse> {
  const { data } = await apiClient.post<SessionResponse>(
    "/auth/2fa/challenge/sms/verify",
    body,
  );
  applySession(data);
  return data;
}

export async function challengeRecovery(
  body: ChallengeRecoveryRequest,
): Promise<SessionResponse> {
  const { data } = await apiClient.post<SessionResponse>(
    "/auth/2fa/challenge/recovery",
    body,
  );
  applySession(data);
  return data;
}
