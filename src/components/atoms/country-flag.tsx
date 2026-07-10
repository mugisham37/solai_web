import { cn } from "@/lib/utils";
import type { TrustCountry } from "@/types/marketing";

interface CountryFlagProps {
  country: TrustCountry;
  className?: string;
}

const FLAG_SHAPES: Record<TrustCountry["code"], React.ReactNode> = {
  rw: (
    <>
      <rect width="20" height="14" fill="#00A1DE" />
      <rect y="8" width="20" height="1.6" fill="#FAD201" />
      <rect y="9.6" width="20" height="4.4" fill="#20603D" />
      <circle cx="15" cy="4" r="2.4" fill="#E5BE01" />
    </>
  ),
  ke: (
    <>
      <rect width="20" height="14" fill="#fff" />
      <rect width="20" height="4.2" fill="#000" />
      <rect y="4.9" width="20" height="4.2" fill="#BB0000" />
      <rect y="9.8" width="20" height="4.2" fill="#006600" />
      <polygon
        points="10,4.5 12.4,7 10,9.5 7.6,7"
        fill="#fff"
        stroke="#000"
        strokeWidth="0.4"
      />
    </>
  ),
  ng: (
    <>
      <rect width="6.67" height="14" fill="#008751" />
      <rect x="6.67" width="6.66" height="14" fill="#fff" />
      <rect x="13.33" width="6.67" height="14" fill="#008751" />
    </>
  ),
  za: (
    <>
      <rect width="20" height="14" fill="#fff" />
      <rect x="7" width="13" height="7" fill="#DE3831" />
      <rect x="7" y="7" width="13" height="7" fill="#002395" />
      <polygon points="0,0 0,14 7,7" fill="#000" />
      <polygon
        points="7,7 12,0 20,0 20,2 9.5,7 20,12 20,14 12,14"
        fill="#007A4D"
      />
    </>
  ),
  sn: (
    <>
      <rect width="6.67" height="14" fill="#00853F" />
      <rect x="6.67" width="6.66" height="14" fill="#FDEF42" />
      <rect x="13.33" width="6.67" height="14" fill="#E31B23" />
      <polygon
        points="10,4.6 10.6,6.4 12.4,6.4 10.9,7.5 11.5,9.3 10,8.2 8.5,9.3 9.1,7.5 7.6,6.4 9.4,6.4"
        fill="#00853F"
      />
    </>
  ),
};

export function CountryFlag({ country, className }: CountryFlagProps) {
  return (
    <span
      role="img"
      aria-label={country.name}
      className={cn(
        "inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-white/15",
        className,
      )}
    >
      <svg viewBox="0 0 20 14" width="100%" height="100%" aria-hidden="true">
        {FLAG_SHAPES[country.code]}
      </svg>
    </span>
  );
}
