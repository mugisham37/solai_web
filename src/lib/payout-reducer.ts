import type {
  ExistingShopSummary,
  HolderInfo,
  PayoutDoneSummary,
  PayoutFormSnapshot,
  PayoutScreenState,
  PayoutState,
} from "@/types/payout";

export type PayoutAction =
  | { type: "RESTORE"; payoutState: PayoutState }
  | { type: "UPDATE_FORM"; form: PayoutFormSnapshot }
  | { type: "GO_FORM" }
  | { type: "GO_CONFIRM"; form: PayoutFormSnapshot; holder: HolderInfo }
  | {
      type: "GO_VERIFY";
      form: PayoutFormSnapshot;
      holder?: HolderInfo;
      mode?: "signup" | "signin";
    }
  | { type: "OTP_FAILED"; attempts: number; lockoutUntil?: string }
  | { type: "GO_LOCKED"; form: PayoutFormSnapshot; lockoutUntil: string }
  | { type: "GO_WORKING"; form: PayoutFormSnapshot; phase?: "verify" | "link" | "migrate" }
  | { type: "SET_WORKING_PHASE"; phase: "verify" | "link" | "migrate" }
  | { type: "GO_DONE"; summary: PayoutDoneSummary }
  | { type: "GO_INUSE"; form: PayoutFormSnapshot; existingShop: ExistingShopSummary }
  | { type: "GO_UNSUPPORTED"; form: PayoutFormSnapshot; networkName: string }
  | {
      type: "GO_ERROR";
      form: PayoutFormSnapshot;
      message: string;
      retryTarget: "verify" | "working" | "form";
      holderName?: string;
    };

export type PayoutReducerState = Readonly<{
  payoutState: PayoutState;
}>;

export function payoutStateToScreen(state: PayoutState): PayoutScreenState {
  return state.state;
}

const VALID: PayoutScreenState[] = [
  "form",
  "confirm",
  "verify",
  "working",
  "done",
  "locked",
  "inuse",
  "unsupported",
  "error",
];

export function hashToPayoutScreen(hash: string): PayoutScreenState | null {
  if (VALID.includes(hash as PayoutScreenState)) return hash as PayoutScreenState;
  return null;
}

export function screenToHash(screen: PayoutScreenState): string {
  return screen;
}

export const PAYOUT_PROGRESS: Record<PayoutScreenState, number> = {
  form: 56,
  confirm: 60,
  verify: 64,
  working: 70,
  locked: 56,
  inuse: 56,
  unsupported: 56,
  error: 56,
  done: 76,
};

export function payoutReducer(
  prev: PayoutReducerState,
  action: PayoutAction,
): PayoutReducerState {
  switch (action.type) {
    case "RESTORE":
      return { payoutState: action.payoutState };
    case "UPDATE_FORM":
      if (prev.payoutState.state !== "form") return prev;
      return { payoutState: { state: "form", form: action.form } };
    case "GO_FORM":
      return {
        payoutState: {
          state: "form",
          form: "form" in prev.payoutState ? prev.payoutState.form : undefined,
        },
      };
    case "GO_CONFIRM":
      return { payoutState: { state: "confirm", form: action.form, holder: action.holder } };
    case "GO_VERIFY":
      return {
        payoutState: {
          state: "verify",
          form: action.form,
          holder: action.holder,
          otpAttempts: 1,
          mode: action.mode ?? "signup",
        },
      };
    case "OTP_FAILED":
      if (prev.payoutState.state !== "verify") return prev;
      return {
        payoutState: {
          ...prev.payoutState,
          otpAttempts: action.attempts,
        },
      };
    case "GO_LOCKED":
      return {
        payoutState: {
          state: "locked",
          form: action.form,
          lockoutUntil: action.lockoutUntil,
        },
      };
    case "GO_WORKING":
      return {
        payoutState: {
          state: "working",
          form: action.form,
          phase: action.phase ?? "verify",
        },
      };
    case "SET_WORKING_PHASE":
      if (prev.payoutState.state !== "working") return prev;
      return { payoutState: { ...prev.payoutState, phase: action.phase } };
    case "GO_DONE":
      return { payoutState: { state: "done", summary: action.summary } };
    case "GO_INUSE":
      return {
        payoutState: { state: "inuse", form: action.form, existingShop: action.existingShop },
      };
    case "GO_UNSUPPORTED":
      return {
        payoutState: {
          state: "unsupported",
          form: action.form,
          networkName: action.networkName,
        },
      };
    case "GO_ERROR":
      return {
        payoutState: {
          state: "error",
          form: action.form,
          message: action.message,
          retryTarget: action.retryTarget,
          holderName: action.holderName,
        },
      };
    default:
      return prev;
  }
}
