"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How long a confirmation stays on screen before it fades. */
export const TOAST_DURATION_MS = 2600;

export type ToastState = Readonly<{
  /** Changes on every call so repeat messages still re-announce. */
  id: number;
  message: string;
}>;

export function useToast() {
  const [toastState, setToastState] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counter = useRef(0);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    clearTimer();
    setToastState(null);
  }, [clearTimer]);

  const toast = useCallback(
    (message: string) => {
      clearTimer();
      counter.current += 1;
      setToastState({ id: counter.current, message });
      timer.current = setTimeout(() => {
        setToastState(null);
        timer.current = null;
      }, TOAST_DURATION_MS);
    },
    [clearTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  return { toast, toastState, dismiss };
}
