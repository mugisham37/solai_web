"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Guards against SSR/client mismatches for anything that reads
 * browser-only or persisted state (e.g. next-themes' resolved theme,
 * which the server cannot know ahead of hydration).
 */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
