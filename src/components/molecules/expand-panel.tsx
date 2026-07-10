"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE_BRAND } from "@/lib/motion/variants";

interface ExpandPanelProps {
  isOpen: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function ExpandPanel({ isOpen, id, className, children }: ExpandPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { duration: 0.28, ease: EASE_BRAND };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={id}
          key="panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={transition}
          className={cn("overflow-hidden", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
