"use client";

import type { BankOption } from "@/types/payout";
import { Icon } from "@/components/atoms/Icon";

type BankAccountFieldsProps = {
  banks: readonly BankOption[];
  bankId: string;
  onBankChange: (id: string) => void;
  accountNumber: string;
  onAccountChange: (value: string) => void;
  bankLabel: string;
  accountLabel: string;
  hint: string;
  note: string;
};

export function BankAccountFields({
  banks,
  bankId,
  onBankChange,
  accountNumber,
  onAccountChange,
  bankLabel,
  accountLabel,
  hint,
  note,
}: BankAccountFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-45">{bankLabel}</span>
        <select
          className="min-h-11 w-full rounded-xl border border-ink-20 bg-white px-3 py-3 outline-none focus:border-sun"
          value={bankId}
          onChange={(e) => onBankChange(e.target.value)}
        >
          <option value="">{banks.length ? "Choose your bank" : "Loading…"}</option>
          {banks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-45">{accountLabel}</span>
        <input
          className="min-h-11 rounded-xl border border-ink-20 bg-white px-3 py-3 outline-none focus:border-sun"
          inputMode="numeric"
          autoComplete="off"
          value={accountNumber}
          onChange={(e) => onAccountChange(e.target.value.replace(/\D/g, ""))}
          placeholder="00012345678"
        />
        <span className="text-[0.73rem] text-ink-45">{hint}</span>
      </label>
      <div className="rounded-xl bg-paper-2 p-3 text-[0.82rem] leading-snug text-ink-70">
        <Icon name="clock" size="sm" className="mr-1 inline-block align-[-4px]" />
        {note}
      </div>
    </div>
  );
}
