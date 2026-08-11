import { SLUG_MAX_LENGTH, SLUG_MIN_LENGTH } from "@/types/live";

/**
 * Shape rules only. Whether a slug is *allowed* is decided on the server, since
 * the reserved-word list must never reach the browser.
 */

/**
 * Normalise typed input to what the URL will actually contain, so the field can
 * be rewritten as they type and there is no gap between input and result.
 */
export function sanitiseSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .slice(0, SLUG_MAX_LENGTH);
}

export type SlugShapeIssue = "too-short" | "too-long" | "unchanged";

export function checkSlugShape(slug: string, currentSlug: string): SlugShapeIssue | null {
  if (slug.length < SLUG_MIN_LENGTH) return "too-short";
  if (slug.length > SLUG_MAX_LENGTH) return "too-long";
  if (slug === currentSlug) return "unchanged";
  return null;
}

/**
 * Suggestions are derived from the shop name so they stay memorable.
 * A random string is easy to generate and impossible to remember.
 */
export function deriveSlugSuggestions(
  shopName: string,
  city: string | undefined,
  taken: readonly string[] = [],
): string[] {
  const base = sanitiseSlug(shopName);
  if (!base) return [];

  const head = base.split("-")[0] ?? base;
  const cityPart = city ? sanitiseSlug(city) : "";

  const candidates = [
    base,
    head,
    cityPart ? `${head}-${cityPart}` : "",
    `${head}-shop`,
    `shop-${head}`,
    base.includes("-") ? base.replace(/-/g, "") : `${head}-official`,
  ];

  const seen = new Set(taken);
  const out: string[] = [];
  for (const candidate of candidates) {
    const slug = sanitiseSlug(candidate);
    if (!slug || slug.length < SLUG_MIN_LENGTH || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
    if (out.length === 4) break;
  }
  return out;
}
