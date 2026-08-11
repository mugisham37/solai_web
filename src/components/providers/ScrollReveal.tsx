"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delayClass?: string;
};

export function ScrollReveal({ children, className, delayClass }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("reveal-in");
      return;
    }

    let ctx: { revert: () => void } | undefined;

    void import("gsap").then(({ gsap }) => {
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.set(el, { opacity: 0, y: 18 });
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
            });
          },
        });
        ctx = {
          revert: () => {
            trigger.kill();
          },
        };
      });
    });

    return () => ctx?.revert();
  }, []);

  return (
    <div ref={ref} className={cn("reveal-ready", delayClass, className)}>
      {children}
    </div>
  );
}
