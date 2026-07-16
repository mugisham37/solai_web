"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { OnboardingStepper } from "@/components/organisms/onboarding/OnboardingStepper";
import { STEP_ROUTES } from "@/types/onboarding";
import type { OnboardingStepIndex } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  step: OnboardingStepIndex;
  children: React.ReactNode;
  nextLabel?: string;
  nextDisabled?: boolean;
  showSave?: boolean;
  onContinue?: () => void | Promise<void>;
  hideFooter?: boolean;
}

export function OnboardingLayout({
  step,
  children,
  nextLabel = "Continue",
  nextDisabled = false,
  showSave = true,
  onContinue,
  hideFooter = false,
}: OnboardingLayoutProps) {
  const router = useRouter();
  const backHref = step > 0 ? STEP_ROUTES[step - 1] : null;
  const nextHref = step < 4 ? STEP_ROUTES[step + 1] : null;

  function handleSaveExit() {
    // Draft changes are already persisted to localStorage as they happen.
    router.push("/dashboard");
  }

  async function handleContinue() {
    if (onContinue) {
      await onContinue();
      return;
    }
    if (nextHref) router.push(nextHref);
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="flex flex-wrap items-center gap-4 border-b border-border bg-surface px-4 py-3 md:gap-6 md:px-8">
        <Logo size={24} />
        <OnboardingStepper current={step} />
        {showSave && (
          <button
            type="button"
            onClick={handleSaveExit}
            className="ml-auto rounded-md border border-border px-3.5 py-1.5 text-[13px] font-medium text-text-muted transition-colors hover:border-text-subtle hover:text-text focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
          >
            Save & exit
          </button>
        )}
      </header>

      <main className="flex flex-1 justify-center overflow-y-auto px-4 py-6 md:px-8 md:py-10">
        <div className="w-full max-w-[680px]">{children}</div>
      </main>

      {!hideFooter && (
        <footer className="flex items-center justify-between border-t border-border bg-surface px-4 py-3 md:px-8">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium text-text-muted no-underline transition-colors hover:bg-surface-2 hover:text-text hover:no-underline focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" /> Back
            </Link>
          ) : (
            <div />
          )}
          <button
            type="button"
            disabled={nextDisabled}
            onClick={handleContinue}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border border-brand bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4A6BEE] focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {nextLabel} <ArrowRight className="size-4" />
          </button>
        </footer>
      )}
    </div>
  );
}
