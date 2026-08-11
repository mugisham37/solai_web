import type { IconName } from "@/types/icon";

export type ConsoleSection =
  | "overview"
  | "disputes"
  | "people"
  | "listings"
  | "ledger"
  | "rules";

export type ConsoleView =
  | ConsoleSection
  | "case"
  | "person"
  | "login";

export type ConsoleNavItem = Readonly<{
  section: ConsoleSection;
  href: string;
  labelKey: string;
  icon: IconName;
  /** Included in the phone bottom bar when true. */
  bottom: boolean;
  badge?: "breach";
}>;
