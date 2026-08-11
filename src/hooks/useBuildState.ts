"use client";

import { useCallback, useReducer, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildReducer,
  buildStateToScreen,
  hashToScreen,
  screenToHash,
  type BuildAction,
  type BuildReducerState,
} from "@/lib/build-reducer";
import { DEFAULT_ALLOWANCE_PER_DAY } from "@/data/build";
import type { BuildState } from "@/types/build";

const initialState = (description?: string): BuildReducerState => ({
  allowanceRemaining: DEFAULT_ALLOWANCE_PER_DAY,
  buildState: description
    ? { state: "capture", description }
    : { state: "capture" },
});

export function useBuildState(initialDescription?: string) {
  const [state, dispatch] = useReducer(
    buildReducer,
    initialDescription,
    initialState,
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const syncing = useRef(false);

  const setBuildState = useCallback(
    (buildState: BuildState) => {
      dispatch({ type: "RESTORE_SESSION", buildState });
    },
    [],
  );

  const dispatchAction = useCallback((action: BuildAction) => {
    dispatch(action);
  }, []);

  useEffect(() => {
    const screen = buildStateToScreen(state.buildState);
    if (syncing.current) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("screen", screenToHash(screen));
    const next = `${pathname}?${params.toString()}`;
    router.replace(next, { scroll: false });
  }, [state.buildState, pathname, router, searchParams]);

  useEffect(() => {
    const fromUrl = searchParams.get("screen");
    if (!fromUrl) return;
    const screen = hashToScreen(fromUrl);
    if (!screen) return;
    if (buildStateToScreen(state.buildState) === screen) return;
    syncing.current = true;
    if (screen === "capture") dispatch({ type: "GO_CAPTURE" });
    syncing.current = false;
  }, [searchParams, state.buildState]);

  return {
    ...state,
    dispatch: dispatchAction,
    setBuildState,
  };
}
