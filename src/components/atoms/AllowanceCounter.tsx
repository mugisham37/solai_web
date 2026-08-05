type AllowanceCounterProps = {
  remaining: number;
  label: string;
  className?: string;
};

export function AllowanceCounter({ remaining, label, className }: AllowanceCounterProps) {
  return (
    <span className={className} aria-live="polite">
      {label.replace("{count}", String(remaining))}
    </span>
  );
}
