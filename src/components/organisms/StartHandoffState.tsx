"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { createDraftFromQuery } from "@/app/actions/create-draft";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ShimmerBlock } from "@/components/atoms/ShimmerBlock";
import { DURATION, MOTION_EASE } from "@/lib/motion";

type StartHandoffStateProps = {
  q?: string;
  eyebrow: string;
  title: string;
  lede: string;
  errorTitle: string;
  retryLabel: string;
};

/**
 * `/start?q=` entry point. The draft-creating server action sets the
 * `solai_draft_token` cookie, which Next.js only permits from a Server Action
 * or Route Handler — never during a page render — so the action is triggered
 * from the client here instead.
 */
export function StartHandoffState({
  q,
  eyebrow,
  title,
  lede,
  errorTitle,
  retryLabel,
}: StartHandoffStateProps) {
  const reduceMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    createDraftFromQuery(q).catch(() => setFailed(true));
  }, [q]);

  return (
    <motion.main
      className="mx-auto flex min-h-screen w-full max-w-[640px] flex-col justify-center gap-4 px-3.5 py-4 md:px-6 md:py-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div aria-live="polite">
        <Eyebrow className="text-sun-deep">{eyebrow}</Eyebrow>
        <Heading level={1} size="display" className="mt-2 text-d1 normal-case">
          {failed ? errorTitle : title}
        </Heading>
        <Text className="mt-2 text-ink-70">{lede}</Text>
      </div>
      {failed ? (
        <div className="flex flex-wrap gap-2">
          <ActionButton
            type="button"
            variant="sun"
            onClick={() => {
              setFailed(false);
              started.current = true;
              createDraftFromQuery(q).catch(() => setFailed(true));
            }}
          >
            {retryLabel}
          </ActionButton>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <ShimmerBlock key={i} aspectRatio="1" />
          ))}
        </div>
      )}
    </motion.main>
  );
}
