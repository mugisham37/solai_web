import {
  BarChart3,
  CreditCard,
  Globe,
  MessageCircle,
  Plus,
  Send,
  Share2,
  ShoppingBag,
  Smartphone,
  Truck,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { Integration } from "@/types/app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { integrations } from "@/lib/data/app/settings";
import { cn } from "@/lib/utils";

const integrationIcons: Record<string, LucideIcon> = {
  MessageCircle,
  Instagram: Share2,
  Facebook: Share2,
  Globe,
  Video,
  Smartphone,
  CreditCard,
  Send,
  ShoppingBag,
  Truck,
  BarChart3,
};

function IntegrationIcon({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  const Icon = integrationIcons[name] ?? Globe;

  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-md"
      style={{ background: `${color}22`, color }}
    >
      <Icon className="size-[18px]" />
    </span>
  );
}

function groupByCategory(items: Integration[]) {
  const groups = new Map<string, Integration[]>();

  for (const item of items) {
    const existing = groups.get(item.category) ?? [];
    existing.push(item);
    groups.set(item.category, existing);
  }

  return Array.from(groups.entries());
}

export function IntegrationsSettings() {
  const categories = groupByCategory(integrations);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 min-[900px]:px-9">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Integrations
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Channels, payments, and data sources your agents can act on.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">API & webhooks</Button>
          <Button variant="default">
            <Plus className="size-4" />
            Add integration
          </Button>
        </div>
      </header>

      {categories.map(([category, items]) => (
        <section
          key={category}
          className="mb-4 overflow-hidden rounded-lg border border-border bg-surface"
        >
          <div className="border-b border-border px-[18px] py-3.5">
            <h2 className="text-sm font-semibold text-text">{category}</h2>
          </div>
          <div className="grid grid-cols-1 gap-2.5 p-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className={cn(
                  "flex flex-col gap-2 rounded-md border border-border bg-bg p-3.5",
                  item.status === "available" && "opacity-85"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <IntegrationIcon name={item.icon} color={item.color} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text">{item.name}</p>
                    {item.accountId !== "—" && (
                      <p className="truncate font-mono text-xs text-text-muted">
                        {item.accountId}
                      </p>
                    )}
                  </div>
                  {item.status === "connected" ? (
                    <Badge className="border-0 bg-success/10 font-mono text-[10px] text-success uppercase">
                      Connected
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] text-text-subtle uppercase"
                    >
                      Available
                    </Badge>
                  )}
                </div>
                {item.extra && (
                  <p className="text-[11.5px] leading-relaxed text-text-muted">
                    {item.extra}
                  </p>
                )}
                <div className="mt-auto flex justify-end gap-1 border-t border-border pt-1.5">
                  {item.status === "connected" ? (
                    <>
                      <Button variant="link" size="sm" className="h-auto p-1.5">
                        Configure
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-1.5 text-danger"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" size="sm" className="w-full">
                      Connect
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
