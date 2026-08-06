"use client";

import { formatMoney } from "@/lib/money";
import type { BuyerDeliveryArea } from "@/types/buyer";
import { cn } from "@/lib/cn";

type AreaSelectProps = {
  areas: readonly BuyerDeliveryArea[];
  value: string;
  onChange: (areaId: string) => void;
  locale: string;
  formatOption: (area: BuyerDeliveryArea) => string;
  className?: string;
};

export function AreaSelect({
  areas,
  value,
  onChange,
  locale,
  formatOption,
  className,
}: AreaSelectProps) {
  return (
    <select
      className={cn(
        "w-full appearance-none rounded-xl border border-ink-20 bg-white px-3.5 py-3 pr-9 text-[0.95rem] outline-none",
        "bg-[length:5px_5px,5px_5px] bg-[position:calc(100%-19px)_55%,calc(100%-14px)_55%] bg-no-repeat",
        "focus:border-sun focus:shadow-[0_0_0_3px_rgb(255_127_92_/_20%)]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(45deg,transparent 50%,rgba(11,35,34,.45) 50%),linear-gradient(135deg,rgba(11,35,34,.45) 50%,transparent 50%)",
      }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={formatMoney(areas[0]?.fee ?? { amountMinor: 0, currency: "RWF" }, locale)}
    >
      {areas.map((area) => (
        <option key={area.id} value={area.id}>
          {formatOption(area)}
        </option>
      ))}
    </select>
  );
}
