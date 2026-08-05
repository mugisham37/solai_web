"use client";

import { useId } from "react";
import { Chip } from "@/components/atoms/Chip";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Icon } from "@/components/atoms/Icon";
import { ProgressMeter } from "@/components/atoms/ProgressMeter";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/cn";
import { CHECKLIST_IDS, CHECKLIST_TOTAL, type ChecklistId, type ChecklistState } from "@/types/share";

type ChecklistLabels = Readonly<{
  eyebrow: string;
  meterLabel: string;
  /** "{done} of {total}" — also the meter's spoken value. */
  count: string;
  items: Readonly<Record<ChecklistId, { title: string; subtitle: string }>>;
  note: string;
  /** Warm and finished, not another call to action. */
  complete: string;
}>;

type FirstFiveChecklistProps = {
  checklist: ChecklistState;
  labels: ChecklistLabels;
  onToggle: (id: ChecklistId, checked: boolean) => void;
};

/**
 * A nudge, a progress indicator and a piece of coaching at once.
 *
 * Nothing is gated on it and it never nags: ticking is voluntary, and the value
 * is in naming five specific people rather than "tell your friends".
 */
export function FirstFiveChecklist({ checklist, labels, onToggle }: FirstFiveChecklistProps) {
  const groupId = useId();
  const done = CHECKLIST_IDS.filter((id) => checklist[id]).length;
  const complete = done === CHECKLIST_TOTAL;

  return (
    <section className="rounded-card border border-hair bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Eyebrow variant="quiet">{labels.eyebrow}</Eyebrow>
        <Chip variant="line">{labels.count}</Chip>
      </div>

      <ProgressMeter
        value={done}
        max={CHECKLIST_TOTAL}
        label={labels.meterLabel}
        valueText={labels.count}
        className="mb-2.5"
      />

      <ul>
        {CHECKLIST_IDS.map((id) => {
          const checked = checklist[id];
          const inputId = `${groupId}-${id}`;
          const item = labels.items[id];

          return (
            <li key={id} className="[&+&]:border-t [&+&]:border-hair">
              <label
                htmlFor={inputId}
                className="flex cursor-pointer items-center gap-2.5 py-2.5"
              >
                {/* A real checkbox: the tick is styled, the control is native. */}
                <input
                  id={inputId}
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => onToggle(id, event.target.checked)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-lg border-2 transition-colors",
                    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sun",
                    checked ? "border-sea bg-sea text-white" : "border-ink-20 text-transparent",
                  )}
                  aria-hidden
                >
                  <Icon name="check" size="sm" className="size-3.5 stroke-[3]" />
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-[0.93rem] font-bold leading-snug",
                      checked && "text-ink-45 line-through",
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[0.76rem] leading-snug text-ink-45">
                    {item.subtitle}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <Text size="tiny" className="mt-2.5">
        {complete ? labels.complete : labels.note}
      </Text>
    </section>
  );
}
