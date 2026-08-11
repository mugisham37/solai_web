"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { StatusChip } from "@/components/atoms/StatusChip";
import { MoneyDisplay } from "@/components/atoms/Money";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { ConsolePerson, PersonStatus } from "@/types/console";

function statusTone(status: PersonStatus): "live" | "held" | "clay" {
  if (status === "active") return "live";
  if (status === "watch") return "held";
  return "clay";
}

function statusLabel(status: PersonStatus): string {
  if (status === "active") return "Active";
  if (status === "watch") return "Watched";
  return "Suspended";
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type PersonRowProps = {
  person: ConsolePerson;
  locale: string;
  className?: string;
};

export function PersonRow({ person, locale, className }: PersonRowProps) {
  return (
    <Link
      href={`/console/people/${person.id}`}
      className={cn(
        "grid grid-cols-1 gap-1 border-b border-hair bg-white px-3.5 py-3 text-left transition-colors hover:bg-paper-2",
        "@[860px]:grid-cols-[1.4fr_1.1fr_1.2fr_0.9fr_0.9fr_28px] @[860px]:items-center @[860px]:gap-3",
        className,
      )}
    >
      <span
        className="flex items-center gap-2 text-sm before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Name"
      >
        <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-deep text-[0.62rem] font-bold text-on-deep">
          {initials(person.name)}
        </span>
        <span className="font-bold text-ink">{person.name}</span>
      </span>
      <span
        className="flex items-center justify-between gap-2 text-sm text-ink-70 before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Type"
      >
        {person.kind === "seller" ? "Seller" : "Buyer"} · {person.id}
      </span>
      <span
        className="flex items-center justify-between gap-2 text-sm text-ink-70 before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Record"
      >
        {person.delivered} of {person.orders} · {person.upheld} upheld
      </span>
      <span
        className="flex items-center justify-between gap-2 text-sm before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Held"
      >
        <MoneyDisplay value={person.held} locale={locale} />
      </span>
      <span
        className="flex items-center justify-between gap-2 before:mr-2 before:text-[0.68rem] before:font-bold before:tracking-wide before:text-ink-45 before:uppercase before:content-[attr(data-label)] @[860px]:before:hidden"
        data-label="Status"
      >
        <StatusChip
          label={statusLabel(person.status)}
          tone={statusTone(person.status)}
        />
      </span>
      <span className="hidden justify-end text-ink-45 @[860px]:flex">
        <Icon name="chevronRight" size="sm" />
      </span>
    </Link>
  );
}

export function PersonTableHead({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "hidden grid-cols-[1.4fr_1.1fr_1.2fr_0.9fr_0.9fr_28px] gap-3 border-b border-hair px-3.5 py-2 text-[0.68rem] font-bold tracking-wide text-ink-45 uppercase @[860px]:grid",
        className,
      )}
    >
      <span>Name</span>
      <span>Type</span>
      <span>Record</span>
      <span>Held</span>
      <span>Status</span>
      <span />
    </div>
  );
}

type PeopleFiltersProps = {
  active: string;
  counts: Record<string, number>;
  keys: readonly { key: string; label: string }[];
  className?: string;
};

export function PeopleFilters({
  active,
  counts,
  keys,
  className,
}: PeopleFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label="Filter people"
      className={cn("flex flex-wrap gap-1.5", className)}
    >
      {keys.map(({ key, label }) => {
        const pressed = active === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={pressed}
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 rounded-pill border px-3.5 text-[0.82rem] font-bold transition-colors",
              pressed
                ? "border-deep bg-deep text-on-deep"
                : "border-ink-20 bg-white text-ink-70 hover:bg-paper-2",
            )}
            onClick={() => {
              const params = new URLSearchParams();
              if (key !== "all") params.set("filter", key);
              const qs = params.toString();
              router.push(qs ? `${pathname}?${qs}` : pathname);
            }}
          >
            {label}
            <span
              className={cn(
                "rounded-pill px-1.5 py-0.5 text-[0.68rem]",
                pressed ? "bg-white/15 text-on-deep" : "bg-paper-2 text-ink-45",
              )}
            >
              {counts[key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
