"use client";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/atoms/Logo";
import { AutosaveIndicator } from "@/components/atoms/AutosaveIndicator";
import { Icon } from "@/components/atoms/Icon";
import { BuildStepper } from "@/components/molecules/BuildStepper";

type PayoutTopBarProps = {
  stepLabels: Record<string, string>;
  stepperLabels: { nav: string; done: string; current: string };
  draftSavedLabel: string;
  backHref: string;
  backLabel: string;
  progressPct: number;
};

export function PayoutTopBar({
  stepLabels,
  stepperLabels,
  draftSavedLabel,
  backHref,
  backLabel,
  progressPct,
}: PayoutTopBarProps) {
  return (
    <header className="sticky top-0 z-30 shrink-0 bg-deep text-on-deep">
      <div className="flex items-center gap-2 px-3.5 py-2.5 md:px-6 md:py-3">
        <Link
          href={backHref}
          className="grid size-[38px] place-items-center rounded-full border border-deep-hair bg-transparent text-on-deep"
          aria-label={backLabel}
        >
          <Icon name="arrowLeft" size="md" />
        </Link>
        <Logo onDark href="/" />

        <BuildStepper
          activeStep={3}
          stepLabels={stepLabels}
          navLabel={stepperLabels.nav}
          doneLabel={stepperLabels.done}
          currentLabel={stepperLabels.current}
        />

        <span className="flex-1 @[840px]:flex-none" />
        <AutosaveIndicator
          status="saved"
          savedLabel={draftSavedLabel}
          savingLabel={draftSavedLabel}
          offlineLabel={draftSavedLabel}
          onDark
        />
      </div>
      <div className="h-[3px] bg-white/10">
        <span className="block h-full bg-sun transition-[width] duration-500" style={{ width: `${progressPct}%` }} />
      </div>
    </header>
  );
}
