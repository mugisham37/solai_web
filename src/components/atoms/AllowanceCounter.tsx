type AllowanceCounterProps = {
  label: string;
  className?: string;
};

export function AllowanceCounter({ label, className }: AllowanceCounterProps) {
  return (
    <span className={className} aria-live="polite">
      {label}
    </span>
  );
}
