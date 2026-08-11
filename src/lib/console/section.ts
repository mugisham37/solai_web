import { CONSOLE_SECTION_HREF, CONSOLE_VIEW_OWNER } from "@/data/console-nav";
import type { ConsoleSection, ConsoleView } from "@/types/console-nav";

export function normalizeConsolePath(pathname: string): string {
  const trimmed = pathname.replace(/\/$/, "") || "/";
  // Strip locale prefix if present (en|rw|sw|fr)
  return trimmed.replace(/^\/(en|rw|sw|fr)(?=\/|$)/, "") || "/";
}

export function matchConsoleRoute(pathname: string): {
  view: ConsoleView;
  section: ConsoleSection | "login";
  backHref?: string;
} {
  const path = normalizeConsolePath(pathname);

  if (path === "/console/login") {
    return { view: "login", section: "login" };
  }
  if (path === "/console" || path === "/console/") {
    return { view: "overview", section: "overview" };
  }
  if (path === "/console/disputes") {
    return { view: "disputes", section: "disputes" };
  }
  if (path.startsWith("/console/disputes/")) {
    return {
      view: "case",
      section: "disputes",
      backHref: CONSOLE_SECTION_HREF.disputes,
    };
  }
  if (path === "/console/people") {
    return { view: "people", section: "people" };
  }
  if (path.startsWith("/console/people/")) {
    return {
      view: "person",
      section: "people",
      backHref: CONSOLE_SECTION_HREF.people,
    };
  }
  if (path === "/console/listings") {
    return { view: "listings", section: "listings" };
  }
  if (path === "/console/ledger") {
    return { view: "ledger", section: "ledger" };
  }
  if (path === "/console/rules") {
    return { view: "rules", section: "rules" };
  }

  return { view: "overview", section: "overview" };
}

export function consoleViewOwner(view: ConsoleView) {
  return CONSOLE_VIEW_OWNER[view];
}
