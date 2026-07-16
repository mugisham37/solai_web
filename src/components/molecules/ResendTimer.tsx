"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ResendTimerProps {
  seconds: number;
  onResend: () => void | Promise<void>;
  resendLabel?: string;
  className?: string;
  disabled?: boolean;
}

export function ResendTimer({
  seconds,
  onResend,
  resendLabel = "Resend code",
  className,
  disabled = false,
}: ResendTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [loading, setLoading] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [remaining, cycle]);

  const resetTimer = () => setCycle((value) => value + 1);

  const handleResend = async () => {
    if (remaining > 0 || loading || disabled) return;
    setLoading(true);
    try {
      await onResend();
      setRemaining(seconds);
      resetTimer();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("mt-4 text-center text-[13px] text-text-subtle", className)}>
      <p>
        Didn&apos;t receive a code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={remaining > 0 || loading || disabled}
          className="font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending…" : resendLabel}
        </button>
      </p>
      {remaining > 0 ? (
        <p className="mt-1 text-text-subtle">
          You can resend in <strong className="text-text-muted">{remaining}s</strong>
        </p>
      ) : null}
    </div>
  );
}
