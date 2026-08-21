/** No other imports here on purpose — client components need this without
 * pulling in the "@/lib/buyer" barrel, which also re-exports
 * getBuyerService() and transitively next/headers (server-only) via
 * http.ts. */
export const MOMO_TIMEOUT_SECONDS = 119;
