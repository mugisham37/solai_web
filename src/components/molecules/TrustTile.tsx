import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import type { IconName } from "@/types/icon";
import { cn } from "@/lib/cn";

type TrustTileProps = {
  icon: IconName;
  label: string;
  className?: string;
};

export function TrustTile({ icon, label, className }: TrustTileProps) {
  return (
    <div
      className={cn(
        "rounded-tile border border-deep-hair bg-white/10 px-2 py-3 text-center",
        className,
      )}
    >
      <Icon name={icon} className="mx-auto text-sun" />
      <Text size="tiny" surface="dark" className="mt-1.5 font-bold text-on-deep">
        {label}
      </Text>
    </div>
  );
}
