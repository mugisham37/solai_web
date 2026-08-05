import type { CountryConfig } from "@/data/countries";

type CountryOptionProps = {
  country: CountryConfig;
};

export function CountryOption({ country }: CountryOptionProps) {
  return (
    <option value={country.code}>
      {country.flag} {country.dial}
    </option>
  );
}
