"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE_BRAND } from "@/lib/motion/variants";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.5,
        delay: shouldReduceMotion ? 0 : delay,
        ease: EASE_BRAND,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
