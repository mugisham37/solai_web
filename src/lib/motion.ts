export const EASE_STANDARD = "cubic-bezier(0.2, 0.8, 0.3, 1)" as const;

/** Framer Motion easing tuple */
export const MOTION_EASE = [0.2, 0.8, 0.3, 1] as const;

export const DURATION = {
  state: 0.14,
  element: 0.28,
  reveal: 0.65,
} as const;

export const REVEAL = {
  y: 18,
  stagger: 0.08,
  rootMargin: "0px 0px -8% 0px",
  threshold: 0.12,
} as const;

export const COUNT_UP = {
  duration: 1.1,
  threshold: 0.4,
} as const;

/** Dashboard tool motion — Framer only, no GSAP. */
export const DASHBOARD_MOTION = {
  viewRise: { y: 10, duration: 0.3 },
  navPill: { duration: 0.32 },
  countUp: { duration: 0.72 },
  iconLift: 2,
} as const;

/** Buyer storefront / checkout / protected — Framer only, no GSAP. */
export const BUYER_MOTION = {
  viewRise: { y: 12, duration: 0.32 },
  trackFill: { duration: 1.2 },
} as const;

/** Admin console — Framer only, no GSAP. */
export const CONSOLE_MOTION = {
  viewRise: { y: 10, duration: 0.3 },
  navPill: { duration: 0.32 },
  countUp: { duration: 0.72 },
} as const;

export const STEPPER_AUTO_MS = 3200;
