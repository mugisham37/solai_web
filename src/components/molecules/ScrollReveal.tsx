"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}

export function ScrollReveal({
  children,
  className,
  stagger = 0.08,
  y = 24,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;

      const items = ref.current.children;
      gsap.from(items, {
        opacity: 0,
        y,
        duration: 0.6,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
