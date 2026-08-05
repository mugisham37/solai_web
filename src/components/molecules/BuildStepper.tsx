import { Icon } from "@/components/atoms/Icon";
import { BUILD_STEPS } from "@/data/build";
import { cn } from "@/lib/cn";

type BuildStepperProps = {
  /** 1-5. Everything before it reads as done, everything after as pending. */
  activeStep: number;
  stepLabels: Record<string, string>;
  navLabel: string;
  doneLabel: string;
  currentLabel: string;
};

export function BuildStepper({
  activeStep,
  stepLabels,
  navLabel,
  doneLabel,
  currentLabel,
}: BuildStepperProps) {
  return (
    <nav className="mx-auto hidden items-center gap-1 @[840px]:flex" aria-label={navLabel}>
      <ol className="flex items-center gap-1">
        {BUILD_STEPS.map((step, i) => {
          const done = step.number < activeStep;
          const on = step.number === activeStep;
          return (
            <li key={step.id} className="flex items-center gap-1">
              {i > 0 ? <span className="h-px w-[18px] bg-deep-hair" aria-hidden /> : null}
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold",
                  done && "text-on-deep-60",
                  on && "text-on-deep",
                  !done && !on && "text-on-deep-30",
                )}
                aria-current={on ? "step" : undefined}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full font-display text-[0.66rem] font-extrabold",
                    done && "bg-sea text-white",
                    on && "bg-sun text-sun-ink",
                    !done && !on && "bg-white/10",
                  )}
                  aria-hidden
                >
                  {done ? <Icon name="check" size="sm" className="size-2.5" /> : step.number}
                </span>
                {/* State is spoken, not left to the tick colour. */}
                {done || on ? (
                  <span className="sr-only">{done ? doneLabel : currentLabel}. </span>
                ) : null}
                {stepLabels[step.labelKey] ?? step.id}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
