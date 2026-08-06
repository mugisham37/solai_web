"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type StageOptionProps = {
  index: number;
  title: string;
  body: string;
  isCurrent: boolean;
  onSelect: () => void;
  id: string;
  controlsId: string;
};

export function StageOption({
  index,
  title,
  body,
  isCurrent,
  onSelect,
  id,
  controlsId,
}: StageOptionProps) {
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={isCurrent}
      aria-controls={controlsId}
      tabIndex={isCurrent ? 0 : -1}
      onClick={onSelect}
      className={cn(
        "flex w-full gap-3 rounded-tile border border-deep-hair bg-white/5 p-3.5 text-left text-on-deep transition hover:bg-white/10",
        isCurrent && "border-sun/45 bg-sun/15",
      )}
    >
      <span
        className={cn(
          "grid size-[26px] shrink-0 place-items-center rounded-full bg-white/15 font-display text-xs font-extrabold",
          isCurrent && "bg-sun text-sun-ink",
        )}
      >
        {index + 1}
      </span>
      <span className="flex-1">
        <span className="block text-[0.96rem] font-bold">{title}</span>
        <AnimatePresence initial={false}>
          {isCurrent ? (
            <motion.span
              key="body"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 block overflow-hidden text-[0.82rem] text-on-deep-60"
            >
              {body}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
    </button>
  );
}
