"use client";

import { useTransition } from "react";
import { setGraduatedControlAction } from "@/app/actions/console/person";
import { ToggleSwitch } from "@/components/atoms/ToggleSwitch";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { GraduatedControls } from "@/types/console";

const CONTROLS: readonly {
  key: keyof GraduatedControls;
  title: string;
  subtitle: string;
}[] = [
  {
    key: "extendHold",
    title: "Extend hold window",
    subtitle: "72h → 7 days on new orders",
  },
  {
    key: "capOrderValue",
    title: "Cap order value",
    subtitle: "Refuse orders above RWF 50,000",
  },
  {
    key: "pausePayouts",
    title: "Pause payouts",
    subtitle: "Money keeps collecting, nothing releases",
  },
  {
    key: "hideFromSearch",
    title: "Hide from search",
    subtitle: "The direct link still works",
  },
];

type GraduatedControlsProps = {
  personId: string;
  controls: GraduatedControls;
  className?: string;
};

export function GraduatedControlsPanel({
  personId,
  controls,
  className,
}: GraduatedControlsProps) {
  const { toast } = useToastContext();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {CONTROLS.map((ctl) => (
        <div key={ctl.key} className="flex items-start gap-3">
          <span className="min-w-0 flex-1">
            <span className="block text-[0.92rem] font-bold text-ink">
              {ctl.title}
            </span>
            <span className="block text-[0.74rem] text-ink-45">
              {ctl.subtitle}
            </span>
          </span>
          <ToggleSwitch
            checked={controls[ctl.key]}
            label={ctl.title}
            onChange={(next) => {
              startTransition(async () => {
                const result = await setGraduatedControlAction(
                  personId,
                  ctl.key,
                  next,
                );
                if (result.ok) {
                  toast("Control updated and logged");
                  router.refresh();
                } else {
                  toast("Could not update control");
                }
              });
            }}
          />
        </div>
      ))}
      {pending ? (
        <span className="sr-only" aria-live="polite">
          Updating control
        </span>
      ) : null}
    </div>
  );
}
