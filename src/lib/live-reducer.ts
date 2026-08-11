import type { LiveScreenState, LiveState, LiveSummary, PublishStage } from "@/types/live";

export type LiveAction =
  | { type: "START_PUBLISH" }
  | { type: "PUBLISH_PROGRESS"; stages: readonly PublishStage[]; progress: number }
  | { type: "PUBLISH_DONE"; summary: LiveSummary }
  | { type: "PUBLISH_FAILED"; message: string }
  | { type: "UPDATE_SLUG"; slug: string; shopUrl: string };

export type LiveReducerState = Readonly<{
  liveState: LiveState;
}>;

export const initialLiveState: LiveReducerState = {
  liveState: { state: "publishing", stages: [], progress: 0 },
};

export function liveStateToScreen(state: LiveState): LiveScreenState {
  return state.state;
}

const VALID: LiveScreenState[] = ["publishing", "live", "error"];

export function hashToLiveScreen(hash: string): LiveScreenState | null {
  return VALID.includes(hash as LiveScreenState) ? (hash as LiveScreenState) : null;
}

/** Top-bar progress. Screen 3 hands over at 76%; screen 5 finishes the bar. */
export const LIVE_PROGRESS: Record<LiveScreenState, number> = {
  publishing: 78,
  live: 84,
  error: 78,
};

export function liveReducer(prev: LiveReducerState, action: LiveAction): LiveReducerState {
  switch (action.type) {
    case "START_PUBLISH":
      return { liveState: { state: "publishing", stages: [], progress: 0 } };

    case "PUBLISH_PROGRESS":
      // A late poll must not drag the screen back out of the live state.
      if (prev.liveState.state !== "publishing") return prev;
      return {
        liveState: { state: "publishing", stages: action.stages, progress: action.progress },
      };

    case "PUBLISH_DONE":
      return { liveState: { state: "live", summary: action.summary } };

    case "PUBLISH_FAILED":
      return { liveState: { state: "error", message: action.message } };

    case "UPDATE_SLUG": {
      if (prev.liveState.state !== "live") return prev;
      const { summary } = prev.liveState;
      return {
        liveState: {
          state: "live",
          summary: {
            ...summary,
            shopSlug: action.slug,
            shopUrl: action.shopUrl,
            slugChangesRemaining: Math.max(0, summary.slugChangesRemaining - 1),
          },
        },
      };
    }

    default:
      return prev;
  }
}
