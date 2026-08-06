import { IconTile } from "@/components/atoms/IconTile";
import { Icon } from "@/components/atoms/Icon";

type PhotoTipCardProps = {
  good: boolean;
  title: string;
  body: string;
};

export function PhotoTipCard({ good, title, body }: PhotoTipCardProps) {
  return (
    <div className="flex gap-2.5 rounded-tile border border-hair bg-white p-3">
      <IconTile variant={good ? "sea" : "berry"} className="size-[26px] shrink-0 rounded-lg">
        <Icon name={good ? "check" : "x"} size="sm" />
      </IconTile>
      <span>
        <span className="block text-sm font-bold">{title}</span>
        <span className="block text-xs text-ink-45">{body}</span>
      </span>
    </div>
  );
}
