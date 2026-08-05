import { cn } from "@/lib/cn";
import type { MobileNetwork } from "@/data/countries";

type NetworkChipProps = {
  network: MobileNetwork | null;
  detectingLabel: string;
  unknownLabel: string;
  className?: string;
};

export function NetworkChip({ network, detectingLabel, unknownLabel, className }: NetworkChipProps) {
  const label = !network
    ? unknownLabel
    : network.name;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2 py-1 text-[0.74rem] font-bold transition-colors",
        network ? network.chipClass : "bg-paper-2 text-ink-45",
        className,
      )}
    >
      <span className="size-[7px] rounded-full bg-current opacity-70" aria-hidden />
      <span>{network ? label : detectingLabel}</span>
    </span>
  );
}
