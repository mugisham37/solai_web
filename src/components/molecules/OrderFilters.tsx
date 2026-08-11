"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ORDER_FILTER_KEYS } from "@/lib/dashboard/orders-query";
import { cn } from "@/lib/cn";
import type { OrderFilter } from "@/types/dashboard";

type OrderFiltersProps = {
  active: OrderFilter;
  counts: Readonly<Record<OrderFilter, number>>;
  query?: string;
  className?: string;
};

const FILTER_LABEL_KEY: Record<OrderFilter, string> = {
  all: "orders.filters.all",
  held: "orders.filters.held",
  transit: "orders.filters.transit",
  paid: "orders.filters.paid",
  problem: "orders.filters.problem",
};

export function OrderFilters({
  active,
  counts,
  query,
  className,
}: OrderFiltersProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const pathname = usePathname();
  const liveId = useId();
  const announceRef = useRef<HTMLParagraphElement>(null);

  const setFilter = useCallback(
    (filter: OrderFilter) => {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("filter", filter);
      if (query) params.set("q", query);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, query, router],
  );

  const clearQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (active !== "all") params.set("filter", active);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [active, pathname, router]);

  useEffect(() => {
    if (!announceRef.current) return;
    const n = counts[active];
    announceRef.current.textContent = t("orders.filters.resultCount", { count: n });
  }, [active, counts, t]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        role="group"
        aria-label={t("orders.filters.label")}
        className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ORDER_FILTER_KEYS.map((key) => {
          const pressed = active === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(key)}
              className={cn(
                "flex min-h-9 shrink-0 items-center rounded-pill border px-3 py-1.5 text-[0.78rem] font-bold transition-colors",
                pressed
                  ? "border-deep bg-deep text-on-deep"
                  : "border-ink-20 bg-white text-ink-70 hover:bg-paper-2",
              )}
            >
              {t(FILTER_LABEL_KEY[key])}
              <span className="ml-1 opacity-60">{counts[key]}</span>
            </button>
          );
        })}
      </div>

      {query ? (
        <p className="text-[0.73rem] text-ink-45">
          {t("orders.showingMatches", { query })}{" "}
          <button
            type="button"
            onClick={clearQuery}
            className="font-semibold text-ink-70 underline-offset-2 hover:text-ink hover:underline"
          >
            {t("orders.clearSearch")}
          </button>
        </p>
      ) : null}

      <p id={liveId} ref={announceRef} className="sr-only" aria-live="polite" />
    </div>
  );
}
