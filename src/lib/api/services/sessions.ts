import { apiClient } from "@/lib/api/client";
import type { ActiveSessionResponse } from "@/lib/api/types";

export async function listSessions(): Promise<ActiveSessionResponse[]> {
  const { data } = await apiClient.get<ActiveSessionResponse[]>("/sessions");
  return data;
}

export async function revokeSession(sessionId: string): Promise<void> {
  await apiClient.delete(`/sessions/${sessionId}`);
}

export async function revokeOtherSessions(): Promise<void> {
  await apiClient.delete("/sessions");
}
