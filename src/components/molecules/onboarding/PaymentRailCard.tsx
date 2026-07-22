"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { delay } from "@/lib/async-utils";
import type { PaymentRail, PaymentRailState } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface PaymentRailCardProps {
  rail: PaymentRail;
  label: string;
  desc: string;
  tag: string;
  credentialEntry?: boolean;
  state: PaymentRailState;
  onUpdate: (rail: PaymentRail, state: PaymentRailState) => void;
}

export function PaymentRailCard({
  rail,
  label,
  desc,
  tag,
  credentialEntry,
  state,
  onUpdate,
}: PaymentRailCardProps) {
  const [pending, startTransition] = useTransition();
  const [merchantId, setMerchantId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isConnected = state.status === "connected";
  const isConnecting = state.status === "connecting" || pending;

  function handleToggle(enabled: boolean) {
    const next = { ...state, enabled };
    onUpdate(rail, next);
    if (!enabled) {
      onUpdate(rail, { enabled: false, status: "idle" });
    }
  }

  function handleConnect() {
    setFormError(null);
    startTransition(async () => {
      onUpdate(rail, { ...state, enabled: true, status: "connecting" });

      if (rail === "stripe") {
        await delay(800);
        onUpdate(rail, { enabled: true, status: "connected" });
        return;
      }

      if (!merchantId || !apiKey) {
        setFormError("Merchant ID and API key are required");
        onUpdate(rail, { ...state, enabled: true, status: "error", errorReason: "Missing credentials" });
        return;
      }

      await delay(800);
      onUpdate(rail, {
        enabled: true,
        status: "connected",
        merchantId: merchantId || `MM-${Math.floor(Math.random() * 9000 + 1000)}`,
      });
    });
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-5 transition-colors",
        state.enabled && "border-brand/30",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <strong className="block text-[15px] text-text">{label}</strong>
          <span className="mt-0.5 block font-mono text-[10px] tracking-[0.05em] text-text-subtle uppercase">
            {tag}
          </span>
        </div>
        <Switch
          checked={state.enabled}
          onCheckedChange={handleToggle}
          aria-label={`Enable ${label}`}
        />
      </div>
      <p className="text-[13px] text-text-muted">{desc}</p>

      {state.enabled && isConnected && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-success">
          <span className="size-1.5 rounded-full bg-success" aria-hidden />
          {rail === "stripe"
            ? "Connected · Inema Boutique · acct_1N…7xQ"
            : `Connected · Merchant ID: ${state.merchantId}`}
        </div>
      )}

      {state.enabled && !isConnected && (
        <div className="mt-3 space-y-3">
          {credentialEntry ? (
            <>
              <div>
                <Label htmlFor={`${rail}-merchant`} className="text-xs">
                  Merchant ID
                </Label>
                <Input
                  id={`${rail}-merchant`}
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  className="mt-1 border-border bg-bg"
                  placeholder="MM-2847"
                />
              </div>
              <div>
                <Label htmlFor={`${rail}-key`} className="text-xs">
                  API key / Subscription key
                </Label>
                <Input
                  id={`${rail}-key`}
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 border-border bg-bg"
                  placeholder="Paste from provider dashboard"
                />
              </div>
              {formError && (
                <p className="text-xs text-danger" role="alert">
                  {formError}
                </p>
              )}
            </>
          ) : null}
          <button
            type="button"
            disabled={isConnecting}
            onClick={handleConnect}
            className="inline-flex items-center gap-2 rounded-md bg-brand-soft px-3 py-1.5 text-[13px] font-medium text-brand hover:bg-brand hover:text-white disabled:opacity-60"
          >
            {isConnecting && <Loader2 className="size-3.5 animate-spin" />}
            Connect {label}
          </button>
          <p className="text-[11px] text-text-subtle">
            Demo mode — credentials are validated locally and never stored in full.
          </p>
        </div>
      )}
    </div>
  );
}
