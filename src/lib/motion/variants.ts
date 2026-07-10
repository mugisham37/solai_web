import type { Variants } from "framer-motion";

export const EASE_BRAND = [0.2, 0.8, 0.2, 1] as const;

export function staggerContainerVariants(staggerChildren = 0.08): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren } },
  };
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_BRAND },
  },
};
