export const BREAKPOINTS = {
  tablet: 700,
  desktop: 1000,
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;
