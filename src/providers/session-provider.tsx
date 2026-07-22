"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applySession,
  clearSession as clearApiSession,
  refreshSession,
  setSessionExpiredHandler,
} from "@/lib/api/client";
import type {
  SessionResponse,
  UserProfileResponse,
  WorkspaceResponse,
} from "@/lib/api/types";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export interface SessionContextValue {
  status: SessionStatus;
  user: UserProfileResponse | null;
  workspace: WorkspaceResponse | null;
  setSession: (session: SessionResponse) => void;
  updateUser: (user: UserProfileResponse) => void;
  clearSession: () => void;
  refresh: () => Promise<SessionResponse | null>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);

  const clearSessionState = useCallback(() => {
    clearApiSession();
    setUser(null);
    setWorkspace(null);
    setStatus("unauthenticated");
  }, []);

  const setSession = useCallback((session: SessionResponse) => {
    applySession(session);
    setUser(session.user);
    setWorkspace(session.workspace);
    setStatus("authenticated");
  }, []);

  const updateUser = useCallback((next: UserProfileResponse) => {
    setUser(next);
  }, []);

  const refresh = useCallback(async () => {
    const session = await refreshSession();
    if (session) {
      setUser(session.user);
      setWorkspace(session.workspace);
      setStatus("authenticated");
    } else {
      clearSessionState();
    }
    return session;
  }, [clearSessionState]);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      setWorkspace(null);
      setStatus("unauthenticated");
    });

    let cancelled = false;
    void (async () => {
      const session = await refreshSession();
      if (cancelled) return;
      if (session) {
        setUser(session.user);
        setWorkspace(session.workspace);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      status,
      user,
      workspace,
      setSession,
      updateUser,
      clearSession: clearSessionState,
      refresh,
    }),
    [status, user, workspace, setSession, updateUser, clearSessionState, refresh],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}

export function getPostAuthPath(user: UserProfileResponse): string {
  if (!user.email_verified) return "/verify-email";
  if (!user.onboarding_completed) return "/onboarding";
  return "/dashboard";
}
