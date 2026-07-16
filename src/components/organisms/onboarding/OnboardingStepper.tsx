"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { ONBOARDING_STEPS, STEP_ROUTES } from "@/types/onboarding";
import type { OnboardingStepIndex } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface OnboardingStepperProps {
  current: OnboardingStepIndex;
}

export function OnboardingStepper({ current }: OnboardingStepperProps) {
  return (
    <nav
      className="flex flex-1 items-center justify-center"
      aria-label="Onboarding progress"
    >
      <ol className="flex w-full max-w-xl items-center">
        {ONBOARDING_STEPS.map((label, i) => {
          const state =
            i < current ? "done" : i === current ? "active" : "pending";
          const clickable = i < current;

          const circle = (
            <div
              className={cn(
                "relative z-10 flex size-7 items-center justify-center rounded-full border-2 bg-bg text-xs font-semibold transition-all duration-200",
                state === "done" && "border-brand bg-brand text-white",
                state === "active" &&
                  "border-brand text-brand shadow-[0_0_0_4px_var(--brand-soft)]",
                state === "pending" && "border-border text-text-subtle",
              )}
            >
              {state === "done" ? (
                <Check className="size-3.5" strokeWidth={2} />
              ) : (
                i + 1
              )}
            </div>
          );

          return (
            <li
              key={label}
              className="relative flex flex-1 flex-col items-center"
            >
              {i > 0 && (
                <span
                  className={cn(
                    "absolute top-3.5 right-1/2 left-0 -mr-px h-0.5",
                    i <= current ? "bg-brand" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
              {i < ONBOARDING_STEPS.length - 1 && (
                <span
                  className={cn(
                    "absolute top-3.5 right-0 left-1/2 -ml-px h-0.5",
                    i < current ? "bg-brand" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
              {clickable ? (
                <Link
                  href={STEP_ROUTES[i as OnboardingStepIndex]}
                  className="flex flex-col items-center no-underline hover:no-underline focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                  aria-label={`Go back to ${label}`}
                >
                  {circle}
                  <span className="mt-1 hidden text-[10px] text-text-muted md:block">
                    {label}
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col items-center">
                  {circle}
                  <span
                    className={cn(
                      "mt-1 hidden text-[10px] md:block",
                      state === "active"
                        ? "font-medium text-brand"
                        : "text-text-subtle",
                    )}
                  >
                    {label}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
