"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { Toast } from "@/components/atoms/Toast";
import { useToast } from "@/hooks/useToast";

type ToastContextValue = Readonly<{
  toast: (message: string) => void;
  dismiss: () => void;
}>;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toast, toastState, dismiss } = useToast();
  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toastState={toastState} />
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext must be used inside a ToastProvider");
  return ctx;
}
