import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  // `api` is excluded: BFF route handlers are locale-agnostic, and rewriting
  // them to /{locale}/api/... makes every one of them 404.
  matcher: ["/", "/(rw|sw|fr|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
