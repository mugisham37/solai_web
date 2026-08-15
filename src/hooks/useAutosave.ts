"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { get, set } from "idb-keyval";
import type { AutosaveStatus, BuildSession, Draft } from "@/types/build";

const DEBOUNCE_MS = 900;

function idbKey(draftId: string) {
  return `solai-draft-${draftId}`;
}

export async function loadSessionFromIdb(draftId: string): Promise<BuildSession | null> {
  try {
    const data = await get<BuildSession>(idbKey(draftId));
    return data ?? null;
  } catch {
    return null;
  }
}

export async function saveSessionToIdb(session: BuildSession): Promise<void> {
  await set(idbKey(session.draftId), session);
}

async function saveDraftToServer(draft: Draft): Promise<boolean> {
  try {
    const res = await fetch(`/api/draft/${draft.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draft }),
      // Lets the request outlive a page unload/navigation — the failure mode
      // this guards against is an edit typed just before the user leaves,
      // still inside the debounce window, that would otherwise never be sent.
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

type UseAutosaveOptions = {
  draftId: string;
  draft: Draft | null;
  buildState: BuildSession["buildState"];
  allowanceRemaining: number;
};

export function useAutosave({
  draftId,
  draft,
  buildState,
  allowanceRemaining,
}: UseAutosaveOptions) {
  const [status, setStatus] = useState<AutosaveStatus>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>();
  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const persist = useCallback(async () => {
    const current = draftRef.current;
    if (!current) return;
    setStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "saving");
    const session: BuildSession = {
      draftId,
      buildState,
      allowanceRemaining,
      autosaveStatus: "saving",
      lastSavedAt: new Date().toISOString(),
    };
    await saveSessionToIdb({ ...session, buildState });

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("offline");
      return;
    }

    const ok = await saveDraftToServer(current);
    const at = new Date().toISOString();
    setLastSavedAt(at);
    setStatus(ok ? "saved" : "offline");
    await saveSessionToIdb({
      ...session,
      autosaveStatus: ok ? "saved" : "offline",
      lastSavedAt: at,
    });
  }, [allowanceRemaining, buildState, draftId]);

  const debouncedSave = useDebouncedCallback(persist, DEBOUNCE_MS);

  useEffect(() => {
    if (!draft) return;
    debouncedSave();
  }, [draft, debouncedSave]);

  useEffect(() => {
    const onOnline = () => {
      void persist();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [persist]);

  // A pending debounced save is otherwise cancelled outright when this
  // component unmounts (route change) or the tab is backgrounded/closed —
  // flushing it here is what turns "lost if you leave within 900ms" into
  // "sent, and likely to complete" (paired with `keepalive` above).
  useEffect(() => {
    const flush = () => debouncedSave.flush();
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", flush);
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  const saveNow = useCallback(() => {
    debouncedSave.cancel();
    void persist();
  }, [debouncedSave, persist]);

  const saveOnBlur = useCallback(() => {
    debouncedSave.cancel();
    void persist();
  }, [debouncedSave, persist]);

  return { status, lastSavedAt, saveNow, saveOnBlur };
}
