"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  payoutReducer,
  payoutStateToScreen,
  screenToHash,
  type PayoutAction,
  type PayoutReducerState,
} from "@/lib/payout-reducer";
import type { PayoutState } from "@/types/payout";

const initialState: PayoutReducerState = {
  payoutState: { state: "form" },
};

export function usePayoutState() {
  const [state, dispatch] = useReducer(payoutReducer, initialState);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const syncing = useRef(false);

  const dispatchAction = useCallback((action: PayoutAction) => {
    dispatch(action);
  }, []);

  const setPayoutState = useCallback((payoutState: PayoutState) => {
    dispatch({ type: "RESTORE", payoutState });
  }, []);

  useEffect(() => {
    if (syncing.current) return;
    const screen = payoutStateToScreen(state.payoutState);
    const params = new URLSearchParams(searchParams.toString());
    params.set("screen", screenToHash(screen));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams, state.payoutState]);

  return {
    ...state,
    dispatch: dispatchAction,
    setPayoutState,
  };
}
