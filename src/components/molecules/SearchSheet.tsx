"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { searchDashboardAction } from "@/app/actions/dashboard/search";
import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { MoneyDisplay } from "@/components/atoms/Money";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { orderTotal } from "@/lib/dashboard/derive";
import { cn } from "@/lib/cn";
import type { DashboardOrder, DashboardProduct } from "@/types/dashboard";

type SearchSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SearchResults = {
  orders: readonly DashboardOrder[];
  products: readonly DashboardProduct[];
};

export function SearchSheet({ open, onOpenChange }: SearchSheetProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [pending, startTransition] = useTransition();

  const close = (next: boolean) => {
    if (!next) {
      setQuery("");
      setResults(null);
    }
    onOpenChange(next);
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    const q = value.trim().toLowerCase();
    if (q.length < 2) {
      setResults(null);
      return;
    }
    startTransition(async () => {
      const next = await searchDashboardAction(q);
      setResults(next);
    });
  };

  const trimmed = query.trim().toLowerCase();
  const showMin = trimmed.length < 2;
  const empty =
    !showMin &&
    !pending &&
    results !== null &&
    results.orders.length === 0 &&
    results.products.length === 0;

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent
        className={cn(
          "inset-auto right-0 bottom-0 left-0 max-h-[88vh] rounded-t-[22px] border border-hair bg-paper p-5 text-ink",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "@[700px]/app:inset-auto @[700px]/app:top-1/2 @[700px]/app:left-1/2 @[700px]/app:max-h-[min(90vh,640px)] @[700px]/app:w-[min(100%-2rem,480px)] @[700px]/app:-translate-x-1/2 @[700px]/app:-translate-y-1/2 @[700px]/app:rounded-card",
        )}
      >
        <SheetTitle className="font-display text-d3 font-bold text-ink uppercase">
          {t("search.title")}
        </SheetTitle>
        <input
          autoFocus
          className="mt-3 min-h-11 w-full rounded-xl border border-ink-20 bg-white px-3 py-2.5 outline-none focus:border-ink"
          placeholder={t("search.placeholder")}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          autoComplete="off"
        />
        <div className="mt-3 flex max-h-[55vh] flex-col gap-2 overflow-auto">
          {showMin ? (
            <p className="text-[0.73rem] text-ink-45">{t("search.minChars")}</p>
          ) : pending && !results ? (
            <p className="text-[0.73rem] text-ink-45">{t("search.searching")}</p>
          ) : empty ? (
            <p className="text-[0.73rem] text-ink-45">
              {t("search.none", { query: trimmed })}
            </p>
          ) : results ? (
            <>
              {results.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  onClick={() => close(false)}
                  className="flex min-h-11 w-full items-center gap-2.5 rounded-tile border border-hair bg-white px-3 py-2.5 text-left hover:bg-paper-2"
                >
                  <IconTile variant="neutral">
                    <Icon name="tag" />
                  </IconTile>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.91rem] font-bold text-ink">
                      #{order.id} · {order.buyerName}
                    </span>
                    <span className="block text-[0.73rem] text-ink-45">
                      {order.buyerArea} ·{" "}
                      <MoneyDisplay
                        value={orderTotal(order)}
                        locale={locale}
                        className="font-semibold text-ink-45"
                      />
                    </span>
                  </span>
                </Link>
              ))}
              {results.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/dashboard/products/${product.id}`}
                  onClick={() => close(false)}
                  className="flex min-h-11 w-full items-center gap-2.5 rounded-tile border border-hair bg-white px-3 py-2.5 text-left hover:bg-paper-2"
                >
                  <ProductThumb
                    palette={product.palette}
                    beadCount={11}
                    size="sm"
                    className="size-[34px] rounded-[8px]"
                    gradientId={`search-${product.id}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.91rem] font-bold text-ink">
                      {product.name}
                    </span>
                    <MoneyDisplay
                      value={product.price}
                      locale={locale}
                      className="text-[0.73rem] font-semibold text-ink-45"
                    />
                  </span>
                </Link>
              ))}
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
