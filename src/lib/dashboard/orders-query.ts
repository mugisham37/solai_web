import type { OrderFilter, OrderListQuery } from "@/types/dashboard";

const FILTERS: readonly OrderFilter[] = [
  "all",
  "held",
  "transit",
  "paid",
  "problem",
] as const;

export function isOrderFilter(value: string | undefined): value is OrderFilter {
  return !!value && (FILTERS as readonly string[]).includes(value);
}

/** Parse shareable orders URL state. Filters live in the URL, never only in component state. */
export function parseOrdersSearchParams(input: {
  filter?: string;
  q?: string;
  page?: string;
}): OrderListQuery {
  const filter = isOrderFilter(input.filter) ? input.filter : "all";
  const q = input.q?.trim() || undefined;
  const pageRaw = Number.parseInt(input.page ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  return { filter, q, page };
}

export const ORDER_FILTER_KEYS = FILTERS;
