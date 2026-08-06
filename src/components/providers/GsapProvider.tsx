"use client";

import { useEffect } from "react";

export function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let reverted = false;
    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (reverted) return;
      ScrollTrigger.defaults({ markers: false });
    });
    return () => {
      reverted = true;
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, []);

  return children;
}
