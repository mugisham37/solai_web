import type { CurrencyCode } from "@/types/money";

export type MobileNetwork = Readonly<{
  id: string;
  name: string;
  /** Tailwind classes for chip background + text */
  chipClass: string;
  prefixes: readonly string[];
  /** Whether payouts can land on this network in SolAI */
  payoutSupported: boolean;
}>;

export type CountryConfig = Readonly<{
  code: "RW" | "UG" | "KE" | "TZ";
  dial: string;
  flag: string;
  currency: CurrencyCode;
  /** National significant number length hint (formatting only) */
  nationalLength: number;
  phonePlaceholder: string;
  networks: readonly MobileNetwork[];
}>;

// assumed default — confirm before public launch (§10: name-enquiry / payout
// coverage per rail per market). MTN + Airtel, Rwanda only, is the confirmed
// at-launch default; bank and M-Pesa rails stay deferred. UG/KE/TZ and
// M-Pesa entries below already exist because app/payments/providers/
// pawapay.py's correspondent table covers them (pawaPay itself supports all
// four markets) — that's ahead-of-schedule backend capability, not a signal
// to expose them in the UI before the launch-market decision says so.
export const COUNTRIES: readonly CountryConfig[] = [
  {
    code: "RW",
    dial: "+250",
    flag: "🇷🇼",
    currency: "RWF",
    nationalLength: 9,
    phonePlaceholder: "788 123 456",
    networks: [
      {
        id: "mtn",
        name: "MTN Mobile Money",
        chipClass: "bg-[#FFD84D] text-[#3A2C00]",
        prefixes: ["078", "079"],
        payoutSupported: true,
      },
      {
        id: "airtel",
        name: "Airtel Money",
        chipClass: "bg-[#E8202A] text-white",
        prefixes: ["072", "073"],
        payoutSupported: true,
      },
    ],
  },
  {
    code: "UG",
    dial: "+256",
    flag: "🇺🇬",
    currency: "UGX",
    nationalLength: 9,
    phonePlaceholder: "700 000 000",
    networks: [
      {
        id: "mtn",
        name: "MTN MoMo",
        chipClass: "bg-[#FFD84D] text-[#3A2C00]",
        prefixes: ["077", "078", "076", "039"],
        payoutSupported: true,
      },
      {
        id: "airtel",
        name: "Airtel Money",
        chipClass: "bg-[#E8202A] text-white",
        prefixes: ["070", "075", "074"],
        payoutSupported: true,
      },
    ],
  },
  {
    code: "KE",
    dial: "+254",
    flag: "🇰🇪",
    currency: "KES",
    nationalLength: 9,
    phonePlaceholder: "700 000 000",
    networks: [
      {
        id: "mpesa",
        name: "M-PESA",
        chipClass: "bg-[#1BA94C] text-white",
        prefixes: ["070", "071", "072", "079", "0110", "0111"],
        payoutSupported: true,
      },
      {
        id: "airtel",
        name: "Airtel Money",
        chipClass: "bg-[#E8202A] text-white",
        prefixes: ["073", "078", "0100", "0101"],
        payoutSupported: true,
      },
    ],
  },
  {
    code: "TZ",
    dial: "+255",
    flag: "🇹🇿",
    currency: "TZS",
    nationalLength: 9,
    phonePlaceholder: "700 000 000",
    networks: [
      {
        id: "mpesa",
        name: "M-Pesa",
        chipClass: "bg-[#1BA94C] text-white",
        prefixes: ["074", "075", "076"],
        payoutSupported: true,
      },
      {
        id: "airtel",
        name: "Airtel Money",
        chipClass: "bg-[#E8202A] text-white",
        prefixes: ["078", "068", "069"],
        payoutSupported: true,
      },
    ],
  },
] as const;

export const DEFAULT_COUNTRY_CODE = "RW" as const;

export type CountryCode = (typeof COUNTRIES)[number]["code"];

export function getCountryByCode(code: CountryCode): CountryConfig {
  const found = COUNTRIES.find((c) => c.code === code);
  return found ?? COUNTRIES[0]!;
}

/** Longest-prefix match on national digits with leading zero. */
export function detectNetwork(
  country: CountryConfig,
  nationalDigits: string,
): MobileNetwork | null {
  const norm = nationalDigits.startsWith("0") ? nationalDigits : `0${nationalDigits}`;
  let best: MobileNetwork | null = null;
  let bestLen = 0;
  for (const net of country.networks) {
    for (const pre of net.prefixes) {
      if (norm.startsWith(pre) && pre.length > bestLen) {
        best = net;
        bestLen = pre.length;
      }
    }
  }
  return best;
}
