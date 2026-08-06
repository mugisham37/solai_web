"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BUYER_MOTION, MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type BuyerRiseProps = {
  children: React.ReactNode;
  /** Remount key — e.g. storefront mode or order status. */
  motionKey?: string;
  className?: string;
};

/** Light entrance for buyer shells. Skips when reduced-motion is preferred. */
export function BuyerRise({ children, motionKey, className }: BuyerRiseProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={motionKey}
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y: BUYER_MOTION.viewRise.y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : BUYER_MOTION.viewRise.duration,
        ease: MOTION_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
