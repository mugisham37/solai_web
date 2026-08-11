import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { cn } from "@/lib/cn";

type ConfirmedDeliveryRowProps = {
  text: string;
  className?: string;
};

export function ConfirmedDeliveryRow({ text, className }: ConfirmedDeliveryRowProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <IconTile variant="sea" className="size-7 rounded-[9px]">
        <Icon name="check" size="sm" className="size-3.5" />
      </IconTile>
      <span className="flex-1 text-[0.74rem] leading-snug text-ink-45">{text}</span>
    </div>
  );
}
