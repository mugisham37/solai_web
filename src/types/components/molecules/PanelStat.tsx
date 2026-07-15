interface PanelStatProps {
  value: string;
  label: string;
}

export function PanelStat({ value, label }: PanelStatProps) {
  return (
    <div className="text-center">
      <span className="tnum block font-mono text-xl font-semibold text-text">
        {value}
      </span>
      <span className="mt-1 block text-xs text-text-muted">{label}</span>
    </div>
  );
}
