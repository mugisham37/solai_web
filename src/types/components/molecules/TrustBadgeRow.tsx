import { cn } from "@/lib/utils";

interface TrustBadgeRowProps {
  items: { icon: React.ReactNode; label: string }[];
  className?: string;
}

export function TrustBadgeRow({ items, className }: TrustBadgeRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-t border-border pt-4",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 text-xs text-text-muted"
        >
          {item.icon}
          {item.label}
        </div>
      ))}
    </div>
  );
}
