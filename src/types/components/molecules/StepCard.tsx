import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface StepCardProps {
  num: string;
  icon: IconName;
  title: string;
  desc: string;
  className?: string;
}

export function StepCard({ num, icon, title, desc, className }: StepCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-surface p-5 pt-6",
        className,
      )}
    >
      <div className="mb-3 font-mono text-xs text-text-subtle">{num}</div>
      <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-brand-soft text-brand">
        <DynamicIcon name={icon} className="size-6" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-text">{title}</h3>
      <p className="text-[13px] leading-relaxed text-text-muted">{desc}</p>
    </div>
  );
}
