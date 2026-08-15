"use client";

import { useCallback, useId, useMemo, useState } from "react";
import {
  COUNTRIES,
  DEFAULT_COUNTRY_CODE,
  detectNetwork,
  getCountryByCode,
  type CountryCode,
  type MobileNetwork,
} from "@/data/countries";
import { CountryOption } from "@/components/atoms/CountryOption";
import { ErrorText } from "@/components/atoms/ErrorText";
import { NetworkChip } from "@/components/atoms/NetworkChip";
import { digitsOnly, formatNationalDisplay, isValidNationalPhone, toE164 } from "@/lib/phone/format";
import { cn } from "@/lib/cn";

export type PhoneNumberFieldValue = Readonly<{
  countryCode: CountryCode;
  nationalDigits: string;
  display: string;
  e164: string | null;
  network: MobileNetwork | null;
}>;

type PhoneNumberFieldProps = {
  countryCode: CountryCode;
  onCountryChange: (code: CountryCode) => void;
  value: string;
  onChange: (next: PhoneNumberFieldValue) => void;
  onBlur?: () => void;
  error?: string;
  helpText: string;
  detectingLabel: string;
  unknownLabel: string;
  label: React.ReactNode;
  className?: string;
};

export function PhoneNumberField({
  countryCode,
  onCountryChange,
  value,
  onChange,
  onBlur,
  error,
  helpText,
  detectingLabel,
  unknownLabel,
  label,
  className,
}: PhoneNumberFieldProps) {
  const country = getCountryByCode(countryCode);
  const inputId = useId();
  const helpId = useId();
  const errId = useId();
  const [touched, setTouched] = useState(false);

  const emit = useCallback(
    (code: CountryCode, raw: string) => {
      const c = getCountryByCode(code);
      const d = digitsOnly(raw).slice(0, c.nationalLength + 1);
      const display = formatNationalDisplay(d);
      const network = d.length >= 3 ? detectNetwork(c, d) : null;
      const e164 = d.length >= c.nationalLength - 1 ? toE164(code, d) : null;
      onChange({
        countryCode: code,
        nationalDigits: d,
        display,
        e164,
        network,
      });
    },
    [onChange],
  );

  const showUnknown = useMemo(() => {
    const d = digitsOnly(value);
    return d.length >= 3 && !detectNetwork(country, d);
  }, [country, value]);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={inputId}
        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink-45"
      >
        {label}
      </label>
      <div className="flex gap-1.5">
        <label className="flex shrink-0 items-center gap-1 rounded-xl border border-ink-20 bg-white px-2 font-bold">
          <select
            className="cursor-pointer bg-transparent py-3 outline-none"
            value={countryCode}
            aria-label="Country"
            onChange={(e) => {
              const code = e.target.value as CountryCode;
              onCountryChange(code);
              emit(code, value);
            }}
          >
            {COUNTRIES.map((c) => (
              <CountryOption key={c.code} country={c} />
            ))}
          </select>
        </label>
        <input
          id={inputId}
          className={cn(
            "min-h-11 flex-1 rounded-xl border border-ink-20 bg-white px-3 py-3 text-base tabular-nums tracking-wide outline-none focus:border-sun focus:shadow-[0_0_0_3px_rgb(255_127_92_/_0.2)]",
            error && touched && "border-clay shadow-[0_0_0_3px_rgb(110_0_0_/_0.14)]",
          )}
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={country.phonePlaceholder}
          value={value}
          aria-describedby={`${helpId}${error && touched ? ` ${errId}` : ""}`}
          aria-invalid={Boolean(error && touched)}
          onChange={(e) => emit(countryCode, e.target.value)}
          onBlur={() => {
            setTouched(true);
            onBlur?.();
          }}
        />
      </div>
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <NetworkChip
          network={showUnknown ? null : detectNetwork(country, digitsOnly(value))}
          detectingLabel={showUnknown ? unknownLabel : digitsOnly(value).length < 3 ? detectingLabel : unknownLabel}
          unknownLabel={unknownLabel}
        />
        <span id={helpId} className="text-xs text-ink-45">
          {helpText}
        </span>
      </div>
      <ErrorText id={errId} message={touched ? error : undefined} />
    </div>
  );
}

export { DEFAULT_COUNTRY_CODE, isValidNationalPhone };
