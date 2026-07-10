"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Continuous, desynced float loop for the hero's layered diagram.
 * Wrapped in gsap.matchMedia so the whole loop is skipped for
 * prefers-reduced-motion, and scoped via useGSAP so the timeline is
 * reverted automatically on unmount (Strict-Mode safe).
 */
export function useHeroFloat<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);

  useGSAP(
    () => {
      const layers = gsap.utils.toArray<HTMLElement>(
        "[data-hero-layer]",
        containerRef.current,
      );

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        layers.forEach((layer, index) => {
          gsap.to(layer, {
            y: index % 2 === 0 ? -10 : 10,
            duration: 2.6 + index * 0.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.3,
          });
        });
      });
    },
    { scope: containerRef },
  );

  return containerRef;
}
