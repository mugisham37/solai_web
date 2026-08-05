"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Chip } from "@/components/atoms/Chip";
import { inferCategory } from "@/lib/categories";
import type { CategoryLabel } from "@/types/category";

type CategoryChipProps = {
  value: string;
  placeholder?: string;
};

export function CategoryChip({ value, placeholder = "" }: CategoryChipProps) {
  const t = useTranslations("categories");
  const inferred = inferCategory(value || placeholder) as CategoryLabel;
  const label = t(inferred);
  const reduce = useReducedMotion();

  return (
    <motion.span
      key={label}
      initial={reduce ? false : { scale: 0.94, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.3, 1] }}
    >
      <Chip variant="sun">{label}</Chip>
    </motion.span>
  );
}
