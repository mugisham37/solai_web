import {
  AlertTriangle,
  ArrowRight,
  Eye,
  MessageCircle,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { AttentionItem } from "@/types/app";
import { cn } from "@/lib/utils";

const attentionIcons: Record<string, LucideIcon> = {
  AlertTriangle,
  Shield,
  Eye,
  MessageCircle,
};

interface NeedsAttentionProps {
  items: AttentionItem[];
  className?: string;
}

export function NeedsAttention({ items, className }: NeedsAttentionProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface p-5",
        className
      )}
    >
      <h2 className="mb-3 text-[15px] font-semibold text-text">
        Needs your eyes
      </h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = attentionIcons[item.icon] ?? AlertTriangle;

          return (
            <div
              key={item.id}
              className="flex gap-2.5 rounded-md border border-border bg-bg p-3"
            >
              <div
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm bg-surface-2"
                style={{ color: item.color }}
              >
                <Icon className="size-[18px]" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="mb-0.5 block text-[13px] text-text">
                  {item.title}
                </strong>
                <p className="mb-2 text-xs text-text-muted">{item.desc}</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {item.action}
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
