"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type StatBlockProps = {
  target: number;
  suffix?: string;
  prefix?: string;
  secondTarget?: number;
  secondSuffix?: string;
  label: string;
  className?: string;
  animate?: boolean;
};

function formatNum(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

function formatVisual(
  display: number,
  display2: number | undefined,
  prefix: string,
  suffix: string,
  secondSuffix: string,
  secondTarget: number | undefined,
) {
  if (secondTarget !== undefined && display2 !== undefined) {
    return `${formatNum(display)}${suffix} ${formatNum(display2)}${secondSuffix}`;
  }
  return `${prefix}${formatNum(display)}${suffix}`;
}

export function StatBlock({
  target,
  suffix = "",
  prefix = "",
  secondTarget,
  secondSuffix = "",
  label,
  className,
  animate = true,
}: StatBlockProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animate && !reduceMotion;
  const [display, setDisplay] = useState(0);
  const [display2, setDisplay2] = useState<number | undefined>(
    secondTarget !== undefined ? 0 : undefined,
  );
  const ref = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (!shouldAnimate) return;

    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (ran.current) return;
      ran.current = true;
      const duration = 1100;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - p) ** 3;
        setDisplay(Math.round(target * eased));
        if (secondTarget !== undefined) {
          setDisplay2(Math.round(secondTarget * eased));
        }
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldAnimate, secondTarget, target]);

  const accessible = formatVisual(target, secondTarget, prefix, suffix, secondSuffix, secondTarget);
  const visual = shouldAnimate
    ? formatVisual(display, display2, prefix, suffix, secondSuffix, secondTarget)
    : accessible;

  return (
    <div ref={ref} className={cn("@container", className)}>
      <p className="font-display text-[1.7rem] font-extrabold leading-none tracking-tight text-on-deep">
        <span aria-hidden>{visual}</span>
        <span className="sr-only">{accessible}</span>
      </p>
      <p className="mt-1 text-[0.74rem] text-on-deep-30">{label}</p>
    </div>
  );
}
