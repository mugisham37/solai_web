import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const avatarColors = [
  "#5B7CFF",
  "#34D399",
  "#FFB547",
  "#F97066",
  "#7AA7FF",
  "#34A853",
];

interface TestimonialCardProps {
  name: string;
  company: string;
  location: string;
  quote: string;
  className?: string;
}

export function TestimonialCard({
  name,
  company,
  location,
  quote,
  className,
}: TestimonialCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const color = avatarColors[name.length % avatarColors.length];

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-6",
        className,
      )}
    >
      <p className="mb-4 text-[15px] leading-[1.7] text-text italic">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback
            className="text-[13px] font-semibold"
            style={{ background: `${color}18`, color }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <span className="block text-sm font-semibold text-text">{name}</span>
          <span className="block text-xs text-text-subtle">
            {company} · {location}
          </span>
        </div>
      </div>
    </div>
  );
}
