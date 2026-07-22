import { apiClient } from "@/lib/api/client";
import type { PaginatedAuditResponse } from "@/lib/api/types";

export async function listAudit(params: {
  limit?: number;
  offset?: number;
  workspaceId?: string;
}): Promise<PaginatedAuditResponse> {
  const { data } = await apiClient.get<PaginatedAuditResponse>("/audit", {
    params: {
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    },
    headers: params.workspaceId
      ? { "X-Workspace-ID": params.workspaceId }
      : undefined,
  });
  return data;
}
