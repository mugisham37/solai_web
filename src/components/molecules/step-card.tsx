import { MARKETING_ICONS } from "@/lib/marketing-icons";
import type { Step } from "@/types/marketing";

export function StepCard({ step }: { step: Step }) {
  const Icon = MARKETING_ICONS[step.icon];

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="mb-3 font-mono text-xs text-text-subtle">{step.number}</div>
      <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-brand-soft text-brand">
        <Icon size={24} />
      </div>
      <h3 className="mb-2 text-base font-semibold text-text">{step.title}</h3>
      <p className="text-[13px] leading-relaxed text-text-muted">{step.description}</p>
    </div>
  );
}
