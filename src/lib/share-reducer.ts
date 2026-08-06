import {
  EMPTY_CHECKLIST,
  type ChecklistState,
  type ShareChannel,
  type ShareScreenState,
  type ShareState,
  type ShareSummary,
} from "@/types/share";

export type ShareAction =
  | { type: "LOAD_SHARE_DATA"; summary: ShareSummary; checklist: ChecklistState }
  | { type: "LOAD_FAILED"; message: string }
  | { type: "MARK_CHANNEL"; channel: ShareChannel }
  | { type: "SET_CHECKLIST"; checklist: ChecklistState }
  | { type: "MARK_DONE" }
  | { type: "BACK_TO_SHARE" }
  | { type: "SHARE_FAILED"; message: string };

export type ShareReducerState = Readonly<{
  shareState: ShareState;
  /**
   * Which channels the seller has actually used. Kept beside the screen state
   * rather than inside it, because it survives moving to done and back.
   */
  sharedChannels: ReadonlySet<ShareChannel>;
  /**
   * False until the first load settles. Keeps the intent-failure error screen
   * from flashing before we know whether there is anything to share.
   */
  loadSettled: boolean;
}>;

export const initialShareState: ShareReducerState = {
  shareState: { state: "error", summary: null, message: "" },
  sharedChannels: new Set<ShareChannel>(),
  loadSettled: false,
};

export function shareStateToScreen(state: ShareState): ShareScreenState {
  return state.state;
}

const VALID: ShareScreenState[] = ["share", "done", "error"];

export function hashToShareScreen(hash: string): ShareScreenState | null {
  return VALID.includes(hash as ShareScreenState) ? (hash as ShareScreenState) : null;
}

/** Top-bar progress. Screen 4 hands over at 84%; this screen finishes the bar. */
export const SHARE_PROGRESS: Record<ShareScreenState, number> = {
  share: 92,
  done: 100,
  error: 92,
};

function summaryOf(state: ShareState): ShareSummary | null {
  return state.state === "error" ? state.summary : state.summary;
}

function checklistOf(state: ShareState): ChecklistState {
  return state.state === "error" ? EMPTY_CHECKLIST : state.checklist;
}

export function shareReducer(prev: ShareReducerState, action: ShareAction): ShareReducerState {
  switch (action.type) {
    case "LOAD_SHARE_DATA":
      return {
        ...prev,
        loadSettled: true,
        shareState: { state: "share", summary: action.summary, checklist: action.checklist },
      };

    case "LOAD_FAILED":
      return {
        ...prev,
        loadSettled: true,
        shareState: { state: "error", summary: null, message: action.message },
      };

    case "MARK_CHANNEL": {
      if (prev.sharedChannels.has(action.channel)) return prev;
      const next = new Set(prev.sharedChannels);
      next.add(action.channel);
      return { ...prev, sharedChannels: next };
    }

    case "SET_CHECKLIST": {
      if (prev.shareState.state === "error") return prev;
      return {
        ...prev,
        shareState: { ...prev.shareState, checklist: action.checklist },
      };
    }

    case "MARK_DONE": {
      const summary = summaryOf(prev.shareState);
      if (!summary) return prev;
      return {
        ...prev,
        shareState: { state: "done", summary, checklist: checklistOf(prev.shareState) },
      };
    }

    case "BACK_TO_SHARE": {
      const summary = summaryOf(prev.shareState);
      if (!summary) return prev;
      return {
        ...prev,
        shareState: { state: "share", summary, checklist: checklistOf(prev.shareState) },
      };
    }

    /**
     * A share intent that never opened — usually because the app is not
     * installed. The summary is carried through so the error screen can still
     * offer the link to copy.
     */
    case "SHARE_FAILED":
      return {
        ...prev,
        shareState: {
          state: "error",
          summary: summaryOf(prev.shareState),
          message: action.message,
        },
      };

    default:
      return prev;
  }
}
