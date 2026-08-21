"use client";

import { useEffect, useRef, useState } from "react";
import { MOMO_TIMEOUT_SECONDS } from "@/lib/buyer/constants";
import { cn } from "@/lib/cn";

type PaymentCountdownProps = {
  onTimeout: () => void;
  waitingLabel: string;
  stayLabel: string;
  className?: string;
};

function formatLeft(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/** Mount a fresh instance (change `key`) to restart the timer. */
export function PaymentCountdown({
  onTimeout,
  waitingLabel,
  stayLabel,
  className,
}: PaymentCountdownProps) {
  const [left, setLeft] = useState(MOMO_TIMEOUT_SECONDS);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const pct = (left / MOMO_TIMEOUT_SECONDS) * 100;

  return (
    <div className={cn("rounded-card bg-paper-2 p-4 text-center", className)}>
      <p className="text-[0.74rem] text-ink-45">{waitingLabel}</p>
      <p className="font-display my-1 text-[2rem] font-extrabold uppercase tabular-nums">
        {formatLeft(left)}
      </p>
      <div className="h-1.5 overflow-hidden rounded-pill bg-paper">
        <span
          className="block h-full bg-sun transition-[width] duration-1000 linear"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-[0.74rem] text-ink-45">{stayLabel}</p>
    </div>
  );
}
