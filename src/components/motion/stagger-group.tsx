"use client";

import { Children, isValidElement } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion/variants";

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export function StaggerGroup({ children, className, stagger = 0.08 }: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainerVariants(stagger)}
      className={cn(className)}
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <motion.div variants={staggerItemVariants}>{child}</motion.div>
        ) : (
          child
        ),
      )}
    </motion.div>
  );
}
