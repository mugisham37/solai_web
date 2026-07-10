import type { Testimonial } from "@/types/marketing";

const AVATAR_COLORS = [
  "#5B7CFF",
  "#34D399",
  "#FFB547",
  "#F97066",
  "#7AA7FF",
  "#34A853",
];

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  const color = AVATAR_COLORS[testimonial.name.length % AVATAR_COLORS.length];

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <p className="mb-4 text-[15px] leading-relaxed text-text italic">
        “{testimonial.quote}”
      </p>
      <div className="flex items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
          style={{ background: `${color}18`, color }}
        >
          {initials}
        </div>
        <div>
          <span className="block text-sm font-semibold text-text">
            {testimonial.name}
          </span>
          <span className="block text-xs text-text-subtle">
            {testimonial.company} · {testimonial.location}
          </span>
        </div>
      </div>
    </div>
  );
}
