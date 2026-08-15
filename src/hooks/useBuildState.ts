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
  const hydratedFromUrl = useRef(false);

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
    if (syncing.current) return;
    const screen = screenToHash(buildStateToScreen(state.buildState));
    // `router.replace` refetches the RSC payload and hands back a new
    // searchParams object, which re-runs this effect — so replacing
    // unconditionally is an infinite navigation loop that pins the CPU and
    // swallows the seller's clicks. Only write when the URL is actually stale.
    if (searchParams.get("screen") === screen) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("screen", screen);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [state.buildState, pathname, router, searchParams]);

  // Deep links are honoured once, on mount. Re-reading the URL afterwards
  // makes the two effects fight: the state moves on, the URL is briefly stale,
  // and this one drags the seller back to the screen they just left — which is
  // how a finished generation lands back on the capture screen.
  useEffect(() => {
    const fromUrl = searchParams.get("screen");
    if (hydratedFromUrl.current) return;
    hydratedFromUrl.current = true;
    if (!fromUrl) return;
    const screen = hashToScreen(fromUrl);
    if (!screen) return;
    if (buildStateToScreen(state.buildState) === screen) return;
    syncing.current = true;
    if (screen === "capture") dispatch({ type: "GO_CAPTURE" });
    syncing.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    dispatch: dispatchAction,
    setBuildState,
  };
}
