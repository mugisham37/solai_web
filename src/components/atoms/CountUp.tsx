"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { DASHBOARD_MOTION } from "@/lib/motion";
import { cn } from "@/lib/cn";

type CountUpProps = {
  value: number;
  locale?: string;
  className?: string;
  /** Defaults true; runs once on mount. */
  animate?: boolean;
};

function formatNumber(n: number, locale: string) {
  return new Intl.NumberFormat(locale).format(n);
}

/** Tabular count-up for dashboard figures. Final value under reduced motion. */
export function CountUp({
  value,
  locale = "en",
  className,
  animate = true,
}: CountUpProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animate && !reduceMotion;
  const [display, setDisplay] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!shouldAnimate) return;
    if (ran.current) return;
    ran.current = true;

    const durationMs = DASHBOARD_MOTION.countUp.duration * 1000;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - p) ** 3;
      setDisplay(Math.round(value * eased));
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shouldAnimate, value]);

  const shown = shouldAnimate ? display : value;

  return (
    <span className={cn("tabular-nums", className)} aria-label={formatNumber(value, locale)}>
      <span aria-hidden>{formatNumber(shown, locale)}</span>
    </span>
  );
}
