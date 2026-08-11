import {
  PeopleFilters,
  PersonRow,
  PersonTableHead,
} from "@/components/molecules/PersonRow";
import { Icon } from "@/components/atoms/Icon";
import type { PeopleListResult } from "@/types/console";

const FILTER_KEYS = [
  { key: "all", label: "Everyone" },
  { key: "seller", label: "Sellers" },
  { key: "buyer", label: "Buyers" },
  { key: "watch", label: "Flagged" },
  { key: "suspended", label: "Suspended" },
] as const;

type PeopleViewProps = {
  data: PeopleListResult;
  filter: string;
  locale: string;
};

export function PeopleView({ data, filter, locale }: PeopleViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
          People
        </h1>
        <p className="mt-1 max-w-[52ch] text-[0.74rem] text-ink-45">
          Sellers and buyers in one place — a console that can only see one side
          will punish honest sellers on the word of a practised liar.
        </p>
      </div>

      <PeopleFilters
        active={filter}
        counts={data.counts}
        keys={[...FILTER_KEYS]}
      />

      {data.rows.length ? (
        <div className="overflow-hidden rounded-card border border-hair">
          <PersonTableHead />
          {data.rows.map((p) => (
            <PersonRow key={p.id} person={p} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-card border border-hair bg-white px-6 py-12 text-center">
          <Icon name="users" size="lg" className="text-ink-45" />
          <p className="mt-3 font-display text-d3 font-bold">Nobody matches</p>
        </div>
      )}

      <div className="flex gap-2 rounded-xl bg-paper-2 px-3.5 py-3 text-[0.81rem] text-ink-70">
        <Icon name="info" size="sm" className="mt-0.5 shrink-0" />
        <span>
          Serial claimants cost as much as fraudulent sellers. Buyers get the
          same file, with claim history instead of fulfilment.
        </span>
      </div>
    </div>
  );
}
