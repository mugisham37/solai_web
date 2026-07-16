import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/molecules/app/EmptyState";
import { cn } from "@/lib/utils";

function SkeletonKpi() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 h-3 w-20 animate-pulse rounded bg-surface-2" />
      <div className="mb-2 h-7 w-28 animate-pulse rounded bg-surface-2" />
      <div className="h-8 w-full animate-pulse rounded bg-surface-2" />
    </div>
  );
}

export function DashboardEmptyState() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6">
      <EmptyState
        icon={BarChart3}
        title="Your dashboard is ready"
        description="Upload your first product or connect a sales channel and SolAI will start running campaigns, conversations, and optimisations for you."
        actionLabel="Upload first product"
        actionHref="/onboarding/product-budget"
        secondaryLabel="Watch a demo"
        secondaryHref="/features"
        className="pb-8"
      />
      <div
        className={cn(
          "pointer-events-none grid grid-cols-2 gap-3 opacity-40 lg:grid-cols-3 xl:grid-cols-6"
        )}
        aria-hidden
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonKpi key={i} />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-text-subtle">
        Preview of KPI cards once your first campaign is live
      </p>
    </div>
  );
}
