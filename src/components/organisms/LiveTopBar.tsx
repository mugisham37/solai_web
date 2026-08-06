"use client";

import { Chip } from "@/components/atoms/Chip";
import { Icon } from "@/components/atoms/Icon";
import { Logo } from "@/components/atoms/Logo";
import { BuildStepper } from "@/components/molecules/BuildStepper";
import { Link } from "@/i18n/navigation";

type LiveTopBarProps = {
  /** 4 for the live screen, 5 for share. */
  activeStep: number;
  stepLabels: Record<string, string>;
  stepperLabels: { nav: string; done: string; current: string };
  backHref: string;
  backLabel: string;
  /** Shown once the shop is actually reachable, not before. */
  liveChip?: string;
  progressPct: number;
};

export function LiveTopBar({
  activeStep,
  stepLabels,
  stepperLabels,
  backHref,
  backLabel,
  liveChip,
  progressPct,
}: LiveTopBarProps) {
  return (
    <header className="sticky top-0 z-30 shrink-0 bg-deep text-on-deep print:hidden">
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
          activeStep={activeStep}
          stepLabels={stepLabels}
          navLabel={stepperLabels.nav}
          doneLabel={stepperLabels.done}
          currentLabel={stepperLabels.current}
        />

        <span className="flex-1 @[840px]:flex-none" />
        {liveChip ? <Chip variant="live">{liveChip}</Chip> : null}
      </div>

      <div className="h-[3px] bg-white/10">
        <span
          className="block h-full bg-sun transition-[width] duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </header>
  );
}
