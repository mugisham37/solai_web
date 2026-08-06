"use client";

import { useCallback, useEffect, useReducer } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { loadShareData, setShareChecklistItem } from "@/app/actions/share";
import {
  initialShareState,
  shareReducer,
  shareStateToScreen,
  type ShareAction,
} from "@/lib/share-reducer";
import type { ChecklistId, ShareChannel } from "@/types/share";

export function useShareState(draftId: string) {
  const [state, dispatch] = useReducer(shareReducer, initialShareState);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dispatchAction = useCallback((action: ShareAction) => {
    dispatch(action);
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await loadShareData(draftId);
      dispatch({
        type: "LOAD_SHARE_DATA",
        summary: data.summary,
        checklist: data.checklist,
      });
    } catch {
      // The message is filled in by the shell, which owns the copy.
      dispatch({ type: "LOAD_FAILED", message: "" });
    }
  }, [draftId]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Record that a channel was actually used, for the action-bar count. */
  const markChannel = useCallback((channel: ShareChannel) => {
    dispatch({ type: "MARK_CHANNEL", channel });
  }, []);

  /**
   * Tick optimistically, then reconcile with the server.
   *
   * A checkbox that waits for a round-trip feels broken, and nothing is gated on
   * this list, so an optimistic tick costs nothing if the write fails.
   */
  const toggleChecklistItem = useCallback(
    async (id: ChecklistId, checked: boolean) => {
      if (state.shareState.state === "error") return;
      const optimistic = { ...state.shareState.checklist, [id]: checked };
      dispatch({ type: "SET_CHECKLIST", checklist: optimistic });
      try {
        const confirmed = await setShareChecklistItem(draftId, id, checked);
        dispatch({ type: "SET_CHECKLIST", checklist: confirmed });
      } catch {
        dispatch({ type: "SET_CHECKLIST", checklist: state.shareState.checklist });
      }
    },
    [draftId, state.shareState],
  );

  /** Keep `?screen=` in step so back/forward and refresh land somewhere sane. */
  useEffect(() => {
    const screen = shareStateToScreen(state.shareState);
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("screen") === screen) return;
    params.set("screen", screen);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams, state.shareState]);

  return {
    shareState: state.shareState,
    sharedChannels: state.sharedChannels,
    sharedCount: state.sharedChannels.size,
    loadSettled: state.loadSettled,
    dispatch: dispatchAction,
    markChannel,
    toggleChecklistItem,
    reload: load,
  };
}
