import type { ConsoleCapability, ConsoleRole } from "@/types/console";

type PermRow = Readonly<Record<ConsoleRole, boolean>> & {
  readonly labelKey: string;
};

/**
 * Capability matrix — the product. `moveMoney` is false for every role
 * including administrator. There is no endpoint that accepts an arbitrary payee.
 */
export const PERMISSION_MATRIX: Readonly<Record<ConsoleCapability, PermRow>> = {
  seeHeld: {
    support: true,
    finance: true,
    admin: true,
    labelKey: "permissions.seeHeld",
  },
  resolve: {
    support: true,
    finance: true,
    admin: true,
    labelKey: "permissions.resolve",
  },
  resolveBig: {
    support: false,
    finance: true,
    admin: true,
    labelKey: "permissions.resolveBig",
  },
  takedown: {
    support: true,
    finance: false,
    admin: true,
    labelKey: "permissions.takedown",
  },
  suspend: {
    support: false,
    finance: false,
    admin: true,
    labelKey: "permissions.suspend",
  },
  unmask: {
    support: false,
    finance: true,
    admin: true,
    labelKey: "permissions.unmask",
  },
  rules: {
    support: false,
    finance: false,
    admin: true,
    labelKey: "permissions.rules",
  },
  moveMoney: {
    support: false,
    finance: false,
    admin: false,
    labelKey: "permissions.moveMoney",
  },
};

export const CAPABILITY_ORDER: readonly ConsoleCapability[] = [
  "seeHeld",
  "resolve",
  "resolveBig",
  "takedown",
  "suspend",
  "unmask",
  "rules",
  "moveMoney",
];

export function can(
  role: ConsoleRole,
  capability: ConsoleCapability,
): boolean {
  return PERMISSION_MATRIX[capability][role];
}

export function requireCapability(
  role: ConsoleRole,
  capability: ConsoleCapability,
): { ok: true } | { ok: false; error: "forbidden" } {
  if (!can(role, capability)) {
    return { ok: false, error: "forbidden" };
  }
  return { ok: true };
}
