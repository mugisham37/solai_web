import type { BankOption } from "@/types/payout";

// assumed default — confirm before public launch (§10: live bank list
// source/TTL). Illustrative list below; production loads from Flutterwave's
// `/v3/banks` instead, cached 24h (CACHE_MS already matches that TTL, so the
// real adapter only needs to swap where `cache` is populated, not the
// caching policy itself).
const MOCK_BANKS: BankOption[] = [
  { id: "bok", name: "Bank of Kigali", countryCode: "RW" },
  { id: "bpr", name: "BPR Bank Rwanda", countryCode: "RW" },
  { id: "equity-rw", name: "Equity Bank Rwanda", countryCode: "RW" },
  { id: "im-rw", name: "I&M Bank Rwanda", countryCode: "RW" },
  { id: "access-rw", name: "Access Bank Rwanda", countryCode: "RW" },
  { id: "ecobank-rw", name: "Ecobank Rwanda", countryCode: "RW" },
  { id: "ncba-rw", name: "NCBA Bank Rwanda", countryCode: "RW" },
  { id: "urwego", name: "Urwego Bank", countryCode: "RW" },
  { id: "stanbic-ug", name: "Stanbic Bank Uganda", countryCode: "UG" },
  { id: "equity-ke", name: "Equity Bank Kenya", countryCode: "KE" },
  { id: "crdb", name: "CRDB Bank", countryCode: "TZ" },
];

let cache: BankOption[] | null = null;
let cacheAt = 0;
const CACHE_MS = 24 * 60 * 60 * 1000;

export async function fetchBanksForCountry(countryCode: BankOption["countryCode"]): Promise<BankOption[]> {
  const now = Date.now();
  if (!cache || now - cacheAt > CACHE_MS) {
    await new Promise((r) => setTimeout(r, 120));
    cache = MOCK_BANKS;
    cacheAt = now;
  }
  return cache.filter((b) => b.countryCode === countryCode);
}

export function getBankById(id: string): BankOption | undefined {
  return MOCK_BANKS.find((b) => b.id === id);
}
