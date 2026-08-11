import { consoleStore } from "@/lib/console/store";
import type { ConsoleService } from "@/types/console";

export {
  breachCount,
  frozenTotal,
  openDisputeCount,
  slaLevel,
  sortBySlaAscending,
} from "@/lib/console/derive";
export {
  parseDisputesSearchParams,
  parseListingsSearchParams,
  parsePeopleSearchParams,
  DISPUTE_FILTER_KEYS,
  PEOPLE_FILTER_KEYS,
  LISTING_FILTER_KEYS,
} from "@/lib/console/queries";
export { matchConsoleRoute, normalizeConsolePath } from "@/lib/console/section";
export {
  can,
  requireCapability,
  PERMISSION_MATRIX,
  CAPABILITY_ORDER,
} from "@/lib/console/permissions";
export {
  getConsoleSession,
  requireConsoleAgent,
  setConsoleSession,
  clearConsoleSession,
  agentForRole,
  CONSOLE_SESSION_COOKIE,
} from "@/lib/console/auth";
export {
  CASE_REASON_LABELS,
  LISTING_REASON_LABELS,
  OUTCOME_LABELS,
} from "@/lib/console/mock";

let service: ConsoleService = consoleStore;

export function getConsoleService(): ConsoleService {
  return service;
}

export function setConsoleService(next: ConsoleService) {
  service = next;
}
