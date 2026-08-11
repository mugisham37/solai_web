import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";

type NudgeCardProps = {
  href: string;
  icon: IconName;
  title: string;
  subtitle: string;
  className?: string;
};

/** “Worth doing next” row — always a door to the thing it names. */
export function NudgeCard({
  href,
  icon,
  title,
  subtitle,
  className,
}: NudgeCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full min-h-11 items-center gap-2.5 rounded-tile border border-hair bg-white px-3 py-3 text-left transition-colors hover:bg-paper-2",
        className,
      )}
    >
      <IconTile variant="neutral">
        <Icon name={icon} />
      </IconTile>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.91rem] font-bold text-ink">{title}</span>
        <span className="block text-[0.73rem] text-ink-45">{subtitle}</span>
      </span>
      <Icon name="chevronRight" size="sm" className="shrink-0 text-ink-45" />
    </Link>
  );
}
