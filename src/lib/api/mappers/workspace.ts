import type { WorkspaceResponse } from "@/lib/api/types";
import type { WorkspaceInfo } from "@/types/app";

function deriveInitials(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "?";
}

export function mapWorkspace(workspace: WorkspaceResponse): WorkspaceInfo {
  return {
    name: workspace.name,
    plan: workspace.plan,
    region: workspace.region,
    // No team-membership endpoint exists yet — out of scope for this pass.
    members: 1,
    initials: deriveInitials(workspace.name),
  };
}
