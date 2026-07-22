import { apiClient, applySession, clearSession } from "@/lib/api/client";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  SessionResponse,
} from "@/lib/api/types";

export async function register(body: RegisterRequest): Promise<SessionResponse> {
  const { data } = await apiClient.post<SessionResponse>("/auth/register", body);
  applySession(data);
  return data;
}

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", body);
  if ("access_token" in data) {
    applySession(data);
  }
  return data;
}

export async function refresh(): Promise<SessionResponse | null> {
  const { refreshSession } = await import("@/lib/api/client");
  return refreshSession();
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    clearSession();
  }
}

export async function logoutAll(): Promise<void> {
  try {
    await apiClient.post("/auth/logout-all");
  } finally {
    clearSession();
  }
}

export async function forgotPassword(
  body: ForgotPasswordRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    "/auth/password/forgot",
    body,
  );
  return data;
}

export async function resetPassword(
  body: ResetPasswordRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    "/auth/password/reset",
    body,
  );
  return data;
}

export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await apiClient.get<{ status: string }>("/health");
  return data;
}
