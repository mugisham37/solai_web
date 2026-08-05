"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/atoms/Icon";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { ToastState } from "@/hooks/useToast";

type ToastProps = {
  toastState: ToastState | null;
  className?: string;
};

/**
 * A confirmation that never takes focus. The live region is always mounted so
 * screen readers announce the text change rather than the node appearing.
 */
export function Toast({ toastState, className }: ToastProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn("pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4", className)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {toastState ? (
          <motion.span
            key={toastState.id}
            className="flex items-center gap-1.5 rounded-pill bg-deep px-4 py-2.5 text-[0.86rem] font-semibold text-on-deep shadow-lift"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: DURATION.element, ease: MOTION_EASE }}
          >
            <Icon name="check" size="sm" className="text-sun" />
            {toastState.message}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
