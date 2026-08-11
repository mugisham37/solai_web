import type {
  DisputeFilter,
  DisputeListQuery,
  ListingFilter,
  ListingListQuery,
  PeopleFilter,
  PeopleListQuery,
} from "@/types/console";

const DISPUTE_FILTERS: readonly DisputeFilter[] = [
  "open",
  "waiting",
  "escalated",
  "closed",
  "awaiting_approval",
  "all",
];

const PEOPLE_FILTERS: readonly PeopleFilter[] = [
  "all",
  "seller",
  "buyer",
  "watch",
  "suspended",
];

const LISTING_FILTERS: readonly ListingFilter[] = [
  "reported",
  "appeal",
  "down",
  "all",
];

export function isDisputeFilter(
  value: string | undefined,
): value is DisputeFilter {
  return !!value && (DISPUTE_FILTERS as readonly string[]).includes(value);
}

export function isPeopleFilter(
  value: string | undefined,
): value is PeopleFilter {
  return !!value && (PEOPLE_FILTERS as readonly string[]).includes(value);
}

export function isListingFilter(
  value: string | undefined,
): value is ListingFilter {
  return !!value && (LISTING_FILTERS as readonly string[]).includes(value);
}

/** Filters live in the URL so a case list is linkable for a handover. */
export function parseDisputesSearchParams(input: {
  filter?: string;
  q?: string;
}): DisputeListQuery {
  const filter = isDisputeFilter(input.filter) ? input.filter : "open";
  const q = input.q?.trim() || undefined;
  return { filter, q };
}

export function parsePeopleSearchParams(input: {
  filter?: string;
  q?: string;
}): PeopleListQuery {
  const filter = isPeopleFilter(input.filter) ? input.filter : "all";
  const q = input.q?.trim() || undefined;
  return { filter, q };
}

export function parseListingsSearchParams(input: {
  filter?: string;
}): ListingListQuery {
  const filter = isListingFilter(input.filter) ? input.filter : "reported";
  return { filter };
}

export const DISPUTE_FILTER_KEYS = DISPUTE_FILTERS;
export const PEOPLE_FILTER_KEYS = PEOPLE_FILTERS;
export const LISTING_FILTER_KEYS = LISTING_FILTERS;
