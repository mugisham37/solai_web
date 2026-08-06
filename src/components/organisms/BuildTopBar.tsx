"use client";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/atoms/Logo";
import { AutosaveIndicator } from "@/components/atoms/AutosaveIndicator";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { BuildStepper } from "@/components/molecules/BuildStepper";
import type { AutosaveStatus } from "@/types/build";

type BuildTopBarProps = {
  stepLabels: Record<string, string>;
  stepperLabels: { nav: string; done: string; current: string };
  autosaveStatus: AutosaveStatus;
  autosaveSaved: string;
  autosaveSaving: string;
  autosaveOffline: string;
  saveExitLabel: string;
  onSaveExit: () => void;
  progressPct: number;
};

export function BuildTopBar({
  stepLabels,
  stepperLabels,
  autosaveStatus,
  autosaveSaved,
  autosaveSaving,
  autosaveOffline,
  saveExitLabel,
  onSaveExit,
  progressPct,
}: BuildTopBarProps) {
  return (
    <header className="sticky top-0 z-30 shrink-0 bg-deep text-on-deep">
      <div className="flex items-center gap-2 px-3.5 py-2.5 md:px-6 md:py-3">
        <Link
          href="/"
          className="grid size-[38px] place-items-center rounded-full border border-deep-hair bg-transparent text-on-deep"
          aria-label="Back to home"
        >
          <Icon name="arrowLeft" size="md" />
        </Link>
        <Logo onDark href="/" />

        <BuildStepper
          activeStep={2}
          stepLabels={stepLabels}
          navLabel={stepperLabels.nav}
          doneLabel={stepperLabels.done}
          currentLabel={stepperLabels.current}
        />

        <span className="flex-1 @[840px]:flex-none" />
        <AutosaveIndicator
          status={autosaveStatus}
          savedLabel={autosaveSaved}
          savingLabel={autosaveSaving}
          offlineLabel={autosaveOffline}
          onDark
        />
        <ActionButton type="button" variant="line" size="sm" onDark onClick={onSaveExit}>
          {saveExitLabel}
        </ActionButton>
      </div>
      <div className="h-[3px] bg-white/10">
        <span className="block h-full bg-sun transition-[width] duration-500" style={{ width: `${progressPct}%` }} />
      </div>
    </header>
  );
}
