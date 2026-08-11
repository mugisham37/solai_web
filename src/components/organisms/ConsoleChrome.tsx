"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { ConsoleBottomNav } from "@/components/molecules/ConsoleBottomNav";
import { ConsoleSidebar } from "@/components/molecules/ConsoleSidebar";
import { ConsoleTopBar } from "@/components/molecules/ConsoleTopBar";
import { CONSOLE_MOTION, MOTION_EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { ConsoleAgent } from "@/types/console";

type ConsoleChromeProps = {
  children: React.ReactNode;
  agent: ConsoleAgent;
  breachBadge?: number;
  className?: string;
};

export function ConsoleChrome({
  children,
  agent,
  breachBadge = 0,
  className,
}: ConsoleChromeProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "build-app-shell mx-auto flex min-h-screen w-full max-w-[1240px] flex-col bg-paper",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1">
        <ConsoleSidebar agent={agent} breachBadge={breachBadge} />

        <div className="flex min-w-0 flex-1 flex-col">
          <ConsoleTopBar agent={agent} />

          <div className="min-h-0 flex-1">
            <motion.div
              key={pathname}
              className="flex flex-col gap-4 px-3.5 pt-4 pb-[5.4rem] @[700px]:gap-[1.1rem] @[700px]:px-6 @[700px]:pt-5 @[1000px]:gap-5 @[1000px]:px-7 @[1000px]:pt-6 @[1000px]:pb-6"
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: CONSOLE_MOTION.viewRise.y }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: CONSOLE_MOTION.viewRise.duration,
                ease: MOTION_EASE,
              }}
            >
              {children}
            </motion.div>
          </div>

          <ConsoleBottomNav breachBadge={breachBadge} />
        </div>
      </div>
    </div>
  );
}
