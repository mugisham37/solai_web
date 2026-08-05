"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type SparklineProps = {
  /** Relative heights 0–100. No chart library — CSS bars only. */
  values: readonly number[];
  highlightIndex?: number;
  label?: string;
  className?: string;
};

export function Sparkline({
  values,
  highlightIndex,
  label = "Sparkline",
  className,
}: SparklineProps) {
  const reduceMotion = useReducedMotion();
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, [reduceMotion]);

  const showGrown = !!reduceMotion || grown;

  return (
    <div
      className={cn("flex h-[46px] items-end gap-[3px]", className)}
      role="img"
      aria-label={label}
    >
      {values.map((raw, i) => {
        const h = Math.max(4, Math.min(100, raw));
        const hi = highlightIndex === i;
        return (
          <span
            key={i}
            className={cn(
              "block flex-1 rounded-t-[3px] transition-[height] duration-[550ms] ease-[var(--ease-standard)] motion-reduce:transition-none",
              hi ? "bg-sun" : "bg-paper-2",
            )}
            style={{ height: showGrown ? `${h}%` : "4%" }}
          />
        );
      })}
    </div>
  );
}
