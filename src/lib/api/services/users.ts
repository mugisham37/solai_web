import { apiClient } from "@/lib/api/client";
import type {
  MessageResponse,
  PasswordChangeRequest,
  UserProfileResponse,
  UserProfileUpdateRequest,
} from "@/lib/api/types";

export async function getProfile(): Promise<UserProfileResponse> {
  const { data } = await apiClient.get<UserProfileResponse>("/users/me");
  return data;
}

export async function updateProfile(
  body: UserProfileUpdateRequest,
): Promise<UserProfileResponse> {
  const { data } = await apiClient.patch<UserProfileResponse>("/users/me", body);
  return data;
}

export async function changePassword(
  body: PasswordChangeRequest,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>("/users/me/password", body);
  return data;
}

export async function completeOnboarding(): Promise<UserProfileResponse> {
  const { data } = await apiClient.post<UserProfileResponse>(
    "/users/me/onboarding/complete",
  );
  return data;
}
