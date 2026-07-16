"use client";

import {
  Check,
  Loader2,
  Store,
  Users,
  Target,
  MessageCircle,
} from "lucide-react";
import { useState, useTransition } from "react";
import { simulateAuthDelay } from "@/lib/demo-auth";
import { DEMO_CONNECTED_LABELS } from "@/lib/onboarding/constants";
import type { ConnectionProvider, ConnectionState } from "@/types/onboarding";
import { cn } from "@/lib/utils";

const ICONS = {
  store: Store,
  users: Users,
  target: Target,
  messageCircle: MessageCircle,
};

interface ConnectionCardProps {
  provider: ConnectionProvider;
  icon: keyof typeof ICONS;
  label: string;
  desc: string;
  state: ConnectionState;
  onUpdate: (provider: ConnectionProvider, state: ConnectionState) => void;
}

export function ConnectionCard({
  provider,
  icon,
  label,
  desc,
  state,
  onUpdate,
}: ConnectionCardProps) {
  const [pending, startTransition] = useTransition();
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const Icon = ICONS[icon];

  const isConnected = state.status === "connected";
  const isConnecting = state.status === "connecting" || pending;
  const isError = state.status === "error";

  function handleConnect() {
    startTransition(async () => {
      onUpdate(provider, { status: "connecting" });
      await simulateAuthDelay(900);
      const label = DEMO_CONNECTED_LABELS[provider];
      onUpdate(provider, {
        status: "connected",
        accountName: label?.split(" · ")[0]?.replace("Connected as ", ""),
        accountId:
          provider === "meta"
            ? "1847293"
            : provider === "whatsapp"
              ? "+250788123456"
              : undefined,
      });
    });
  }

  function handleDisconnect() {
    if (!confirmDisconnect) {
      setConfirmDisconnect(true);
      return;
    }
    onUpdate(provider, { status: "idle" });
    setConfirmDisconnect(false);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-lg border border-border bg-surface p-4 transition-colors",
        isConnected && "border-success/30",
        isError && "border-danger/30",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-muted",
          isConnected && "bg-success/10 text-success",
        )}
      >
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <strong className="block text-sm text-text">{label}</strong>
        <p className="mt-0.5 text-[13px] text-text-muted">{desc}</p>
        {isConnected && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-success">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            {DEMO_CONNECTED_LABELS[provider] ?? "Connected"}
          </div>
        )}
        {isConnecting && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-brand">
            <Loader2 className="size-3 animate-spin" />
            Redirecting to {label}…
          </div>
        )}
        {isError && (
          <p className="mt-1.5 text-xs text-danger" role="alert">
            {state.errorReason}
          </p>
        )}
      </div>
      {isConnected ? (
        <button
          type="button"
          onClick={handleDisconnect}
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium",
            confirmDisconnect
              ? "bg-danger/10 text-danger"
              : "bg-success/10 text-success",
          )}
        >
          {confirmDisconnect ? (
            "Confirm disconnect"
          ) : (
            <>
              <Check className="size-3.5" /> Connected
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          disabled={isConnecting}
          onClick={handleConnect}
          className="inline-flex shrink-0 items-center rounded-md bg-brand-soft px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-brand hover:text-white disabled:opacity-60"
        >
          {isConnecting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            "Connect"
          )}
        </button>
      )}
    </div>
  );
}
