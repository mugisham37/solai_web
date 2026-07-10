"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { EASE_BRAND } from "@/lib/motion/variants";
import type { Stat } from "@/types/marketing";

const STAT_PATTERN = /^(\D*)(\d+)(\D*)$/;

export function StatBlock({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();
  const match = stat.value.match(STAT_PATTERN);
  const [display, setDisplay] = useState(
    match ? `${match[1]}0${match[3]}` : stat.value,
  );

  useEffect(() => {
    if (!match || !isInView || shouldReduceMotion) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);

    const controls = animate(0, target, {
      duration: 1.2,
      ease: EASE_BRAND,
      onUpdate: (value) => setDisplay(`${prefix}${Math.round(value)}${suffix}`),
    });

    return () => controls.stop();
  }, [isInView, match, shouldReduceMotion]);

  const finalDisplay = shouldReduceMotion ? stat.value : display;

  return (
    <div className="text-center">
      <span
        ref={ref}
        className="block font-mono text-[clamp(28px,4vw,40px)] font-semibold tabular-nums text-text"
      >
        {finalDisplay}
      </span>
      <span className="mt-1 block text-[13px] text-text-subtle">{stat.label}</span>
    </div>
  );
}
