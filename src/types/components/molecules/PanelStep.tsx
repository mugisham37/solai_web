interface PanelStepProps {
  num: string;
  title: string;
  description: string;
}

export function PanelStep({ num, title, description }: PanelStepProps) {
  return (
    <div className="flex gap-3">
      <span className="font-mono text-[11px] font-medium tracking-wider text-brand">
        {num}
      </span>
      <div>
        <strong className="block text-sm font-semibold text-text">{title}</strong>
        <p className="mt-0.5 text-[13px] leading-relaxed text-text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
