import { IconTile } from "@/components/atoms/IconTile";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/cn";

type QuoteCardProps = {
  quote: string;
  initials: string;
  name: string;
  trade: string;
  className?: string;
};

export function QuoteCard({ quote, initials, name, trade, className }: QuoteCardProps) {
  return (
    <figure className={cn("@container m-0 rounded-card border border-hair bg-white p-[1.15rem]", className)}>
      <blockquote className="m-0">
        <Text size="small" className="text-[0.95rem]">
          {quote}
        </Text>
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-2">
        <IconTile variant="deep" className="rounded-full font-bold">
          {initials}
        </IconTile>
        <span>
          <span className="block text-[0.96rem] font-bold">{name}</span>
          <Text size="tiny">{trade}</Text>
        </span>
      </figcaption>
    </figure>
  );
}
