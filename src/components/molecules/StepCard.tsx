import { Chip } from "@/components/atoms/Chip";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { cn } from "@/lib/cn";

type StepCardProps = {
  number: number;
  title: string;
  body: string;
  timeLabel: string;
  className?: string;
};

export function StepCard({ number, title, body, timeLabel, className }: StepCardProps) {
  return (
    <article
      className={cn(
        "@container relative rounded-card border border-hair bg-white px-[1.15rem] pb-[1.15rem] pt-[1.3rem]",
        className,
      )}
    >
      <span className="absolute -top-3.5 left-[1.15rem] grid size-[30px] place-items-center rounded-[10px] bg-sun font-display text-sm font-extrabold text-sun-ink">
        {number}
      </span>
      <Heading level={3} size="h3" className="mb-1.5 normal-case">
        {title}
      </Heading>
      <Text size="small">{body}</Text>
      <div className="mt-3.5 flex flex-wrap gap-2">
        <Chip variant="line">{timeLabel}</Chip>
      </div>
    </article>
  );
}
