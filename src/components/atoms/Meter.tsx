"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type MeterProps = {
  /** 0–100 */
  value: number;
  label: string;
  tone?: "sea" | "berry";
  className?: string;
};

/** Thin fill bar that grows from zero on mount (once). */
export function Meter({ value, label, tone = "sea", className }: MeterProps) {
  const reduceMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = requestAnimationFrame(() => setAnimatedWidth(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped, reduceMotion]);

  const width = reduceMotion ? clamped : animatedWidth;

  return (
    <div
      className={cn("h-1.5 overflow-hidden rounded-pill bg-paper-2", className)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span
        className={cn(
          "block h-full rounded-pill transition-[width] duration-[650ms] ease-[var(--ease-standard)] motion-reduce:transition-none",
          tone === "berry" ? "bg-berry" : "bg-sea",
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
