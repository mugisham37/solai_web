"use client";

import { useEffect, useState } from "react";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";

type ResendControlProps = {
  onResend: () => void;
  onVoice: () => void;
  /** Server-authoritative cooldown length, from the OTP send response. Give
   * this component a `key` that changes on every new send (e.g. a send
   * counter) so a resend gets a fresh countdown instead of reusing stale
   * mounted state. */
  seconds: number;
  resendLabel: string;
  voiceLabel: string;
  countdownTemplate: (seconds: string) => string;
};

export function ResendControl({
  onResend,
  onVoice,
  seconds,
  resendLabel,
  voiceLabel,
  countdownTemplate,
}: ResendControlProps) {
  const [left, setLeft] = useState(seconds);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setShowActions(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const displaySec = `0:${left < 10 ? "0" : ""}${left}`;

  return (
    <div className="flex flex-col items-center gap-2">
      {!showActions ? (
        <p className="text-xs text-ink-45" aria-live="polite" aria-atomic="true">
          {countdownTemplate(displaySec)}
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          <ActionButton type="button" variant="line" size="sm" onClick={onResend}>
            <Icon name="message" size="sm" />
            {resendLabel}
          </ActionButton>
          <ActionButton type="button" variant="line" size="sm" onClick={onVoice}>
            <Icon name="call" size="sm" />
            {voiceLabel}
          </ActionButton>
        </div>
      )}
    </div>
  );
}
