/** Same-origin buyer paths used for in-app preview / open-shop CTAs. */

export function inAppShopPath(slug: string): string {
  return `/${slug}`;
}

export function inAppProductPath(slug: string, productId: string): string {
  return `/${slug}/p/${productId}`;
}

export function inAppOrderPath(orderId: string): string {
  return `/order/${orderId}`;
}

/** Absolute http(s) links open in a new tab; in-app paths stay same-tab. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
