"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  clearDemoSession,
  getDemoSession,
  setDemoSession,
  SESSION_EVENT,
  type DemoSession,
} from "@/lib/demo-session";

function subscribe(callback: () => void) {
  window.addEventListener(SESSION_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SESSION_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getServerSnapshot(): DemoSession | null {
  return null;
}

const readyOnClient = () => true;
const readyOnServer = () => false;

export function useDemoSession() {
  const session = useSyncExternalStore(subscribe, getDemoSession, getServerSnapshot);
  const ready = useSyncExternalStore(subscribe, readyOnClient, readyOnServer);

  const signIn = useCallback(
    (input: { email: string; name?: string; onboardingComplete?: boolean }) => {
      setDemoSession(input);
    },
    [],
  );

  const signOut = useCallback(() => {
    clearDemoSession();
  }, []);

  return { session, ready, signIn, signOut };
}
