/**
 * Server-only. This list must never be sent to the browser: publishing it hands
 * an attacker the exact shape of the moderation rules and the brand-protection
 * list. It is imported solely by the publish service, which server actions call.
 *
 * assumed default — confirm before public launch (§10: reserved-word list
 * ownership). Engineering seeds and maintains this EN/RW/SW/FR profanity +
 * brand-lookalike list; Product reviews it quarterly. The entries below are
 * a working starting set, not a final corpus.
 */

/** Anything that would collide with a platform route. */
const PLATFORM_ROUTES = [
  "about",
  "admin",
  "api",
  "app",
  "auth",
  "blog",
  "build",
  "buy",
  "cart",
  "checkout",
  "contact",
  "dashboard",
  "docs",
  "help",
  "home",
  "legal",
  "live",
  "login",
  "logout",
  "me",
  "new",
  "order",
  "orders",
  "pay",
  "payment",
  "press",
  "pricing",
  "privacy",
  "profile",
  "register",
  "root",
  "search",
  "seller",
  "sellers",
  "settings",
  "share",
  "shop",
  "shops",
  "signin",
  "signup",
  "solai",
  "static",
  "status",
  "store",
  "support",
  "terms",
  "test",
  "user",
  "users",
  "www",
];

/** Lookalike protection for well-known brands. */
const PROTECTED_BRANDS = [
  "adidas",
  "airtel",
  "amazon",
  "apple",
  "bralirwa",
  "cocacola",
  "equity",
  "facebook",
  "google",
  "gucci",
  "instagram",
  "mpesa",
  "mtn",
  "nike",
  "puma",
  "samsung",
  "tiktok",
  "visa",
  "whatsapp",
  "youtube",
];

/** Starting profanity set across the four supported languages. */
const PROFANITY = [
  "arse",
  "bitch",
  "cunt",
  "fuck",
  "shit",
  "slut",
  "whore",
  "merde",
  "putain",
  "salope",
  "connard",
  "malaya",
  "mkundu",
  "kuma",
  "mavi",
  "igishegabo",
  "umumaraya",
  "igicucu",
  "ikimasa",
];

const RESERVED = new Set([...PLATFORM_ROUTES, ...PROTECTED_BRANDS, ...PROFANITY]);

/** Collapse common character swaps so `n1ke` and `nlke` are caught alongside `nike`. */
function foldLookalikes(slug: string): string {
  return slug
    .replace(/-/g, "")
    .replace(/[013457|]/g, (ch) => {
      switch (ch) {
        case "0":
          return "o";
        case "1":
        case "|":
          return "l";
        case "3":
          return "e";
        case "4":
          return "a";
        case "5":
          return "s";
        case "7":
          return "t";
        default:
          return ch;
      }
    });
}

export function isReservedSlug(slug: string): boolean {
  const normalised = slug.toLowerCase();
  if (RESERVED.has(normalised)) return true;

  const folded = foldLookalikes(normalised);
  if (RESERVED.has(folded)) return true;

  // A protected brand as a whole word inside a longer slug is still a lookalike.
  return PROTECTED_BRANDS.some((brand) => folded === brand || folded.startsWith(brand) || folded.endsWith(brand));
}
