"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type OtpInputProps = {
  value: string;
  onChange: (value: string, complete: boolean) => void;
  error?: boolean;
  disabled?: boolean;
  cellLabels: readonly string[];
  /** Default 6 (payout). Delivery codes use 4. */
  length?: number;
};

function digits(v: string) {
  return v.replace(/\D/g, "");
}

export function OtpInput({
  value,
  onChange,
  error,
  disabled,
  cellLabels,
  length = 6,
}: OtpInputProps) {
  const cellCount = length;
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const cells = value.padEnd(cellCount, " ").slice(0, cellCount).split("");

  const emit = useCallback(
    (next: string) => {
      const d = digits(next).slice(0, cellCount);
      onChange(d, d.length === cellCount);
    },
    [onChange, cellCount],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("OTPCredential" in window)) return;
    const ac = new AbortController();
    void (async () => {
      try {
        const cred = (await navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        } as CredentialRequestOptions)) as { code?: string } | null;
        if (cred?.code) emit(cred.code);
      } catch {
        /* unsupported or denied */
      }
    })();
    return () => ac.abort();
  }, [emit]);

  return (
    <div
      className={cn("flex justify-center gap-1.5", error && "motion-safe:animate-[shake_0.35s]")}
      role="group"
      aria-label={`${cellCount} digit code`}
    >
      {cells.map((char, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={cn(
            "size-[46px] rounded-[13px] border border-ink-20 bg-white text-center font-display text-2xl font-extrabold tabular-nums outline-none focus:border-sun focus:shadow-[0_0_0_3px_rgb(255_127_92_/_0.2)] md:size-14 md:text-[1.75rem]",
            char.trim() && "border-sea bg-sea/10",
            error && "border-clay bg-clay/5",
          )}
          inputMode="numeric"
          maxLength={1}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={cellLabels[i] ?? `Digit ${i + 1}`}
          disabled={disabled}
          value={char.trim() ? char : ""}
          onChange={(e) => {
            const d = digits(e.target.value).slice(0, 1);
            const arr = digits(value).split("");
            arr[i] = d;
            const joined = arr.join("").slice(0, cellCount);
            emit(joined);
            if (d && i < cellCount - 1) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !cells[i]?.trim() && i > 0) {
              refs.current[i - 1]?.focus();
            }
            if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight" && i < cellCount - 1) refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const t = digits(e.clipboardData.getData("text")).slice(0, cellCount);
            emit(t);
            refs.current[Math.min(t.length, cellCount - 1)]?.focus();
          }}
        />
      ))}
    </div>
  );
}

export function focusOtpStart(container: HTMLElement | null) {
  const first = container?.querySelector("input");
  first?.focus();
}
