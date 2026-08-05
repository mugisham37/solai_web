import type { Draft } from "@/types/build";

const memoryDrafts = new Map<string, Draft>();

export function saveDraftMemory(draft: Draft) {
  memoryDrafts.set(draft.id, draft);
}

export function getDraftMemory(draftId: string): Draft | undefined {
  return memoryDrafts.get(draftId);
}
