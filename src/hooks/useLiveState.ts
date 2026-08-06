"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getPublishStatus, startPublish } from "@/app/actions/publish";
import {
  initialLiveState,
  liveReducer,
  liveStateToScreen,
  type LiveAction,
} from "@/lib/live-reducer";
import { PUBLISH_POLL_MS } from "@/types/live";

export function useLiveState(draftId: string) {
  const [state, dispatch] = useReducer(liveReducer, initialLiveState);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const settled = useRef(false);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatchAction = useCallback((action: LiveAction) => {
    dispatch(action);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  /**
   * One poll tick, scheduling the next only while the job is still running.
   *
   * The loop is a hoisted inner declaration so it can schedule itself without
   * the surrounding callback having to close over its own binding.
   */
  const poll = useCallback(async () => {
    async function tick(): Promise<void> {
      if (settled.current) return;
      try {
        const status = await getPublishStatus(draftId);
        if (settled.current) return;

        if (status.phase === "done") {
          settled.current = true;
          stopPolling();
          dispatch({ type: "PUBLISH_DONE", summary: status.summary });
          return;
        }
        if (status.phase === "failed") {
          settled.current = true;
          stopPolling();
          dispatch({ type: "PUBLISH_FAILED", message: status.message });
          return;
        }

        dispatch({ type: "PUBLISH_PROGRESS", stages: status.stages, progress: status.progress });
        pollTimer.current = setTimeout(() => void tick(), PUBLISH_POLL_MS);
      } catch {
        settled.current = true;
        stopPolling();
        dispatch({ type: "PUBLISH_FAILED", message: "" });
      }
    }

    await tick();
  }, [draftId, stopPolling]);

  const begin = useCallback(async () => {
    settled.current = false;
    stopPolling();
    dispatch({ type: "START_PUBLISH" });
    try {
      const status = await startPublish(draftId);
      if (status.phase === "done") {
        settled.current = true;
        dispatch({ type: "PUBLISH_DONE", summary: status.summary });
        return;
      }
      if (status.phase === "failed") {
        settled.current = true;
        dispatch({ type: "PUBLISH_FAILED", message: status.message });
        return;
      }
      dispatch({ type: "PUBLISH_PROGRESS", stages: status.stages, progress: status.progress });
      pollTimer.current = setTimeout(() => void poll(), PUBLISH_POLL_MS);
    } catch {
      settled.current = true;
      dispatch({ type: "PUBLISH_FAILED", message: "" });
    }
  }, [draftId, poll, stopPolling]);

  useEffect(() => {
    void begin();
    return stopPolling;
    // Runs once per draft; `begin` is stable for a given draftId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  /**
   * Browsers throttle timers in background tabs, so the poll loop drifts.
   * Catching up on `visibilitychange` means the seller sees the true state the
   * moment they come back, rather than a stale stage.
   */
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== "visible" || settled.current) return;
      stopPolling();
      void poll();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [poll, stopPolling]);

  /** Keep `?screen=` in step so back/forward and refresh land somewhere sane. */
  useEffect(() => {
    const screen = liveStateToScreen(state.liveState);
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("screen") === screen) return;
    params.set("screen", screen);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams, state.liveState]);

  return {
    liveState: state.liveState,
    dispatch: dispatchAction,
    retryPublish: begin,
  };
}
