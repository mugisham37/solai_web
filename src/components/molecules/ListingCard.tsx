"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { StatusChip } from "@/components/atoms/StatusChip";
import { MoneyDisplay } from "@/components/atoms/Money";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";
import type { ConsoleListing } from "@/types/console";

const PALETTES = [
  "from-[#E8D5C4] to-[#C4A484]",
  "from-[#C9D6C2] to-[#7A9B76]",
  "from-[#D4C4E8] to-[#9B7AB8]",
  "from-[#E8C4C4] to-[#B87A7A]",
  "from-[#C4D4E8] to-[#7A9BB8]",
];

type ListingCardProps = {
  listing: ConsoleListing;
  locale: string;
  canTakedown: boolean;
  onTakedown: (id: string) => void;
  onKeep: (id: string) => void;
  onRestore: (id: string) => void;
  className?: string;
};

export function ListingCard({
  listing,
  locale,
  canTakedown,
  onTakedown,
  onKeep,
  onRestore,
  className,
}: ListingCardProps) {
  const down = listing.state === "down";
  const pal = PALETTES[listing.palette % PALETTES.length];

  return (
    <div
      className={cn(
        "rounded-card border border-hair bg-white p-4",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "size-[70px] shrink-0 overflow-hidden rounded-[11px] bg-gradient-to-br",
            pal,
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="m-0 text-[0.92rem] font-bold text-ink">{listing.title}</p>
          <p className="mt-0.5 text-[0.74rem] text-ink-45">
            {listing.sellerName} ·{" "}
            <MoneyDisplay value={listing.price} locale={locale} /> ·{" "}
            {listing.source}
          </p>
          <StatusChip
            label={listing.reasonLabel}
            tone={down ? "grey" : "clay"}
            className="mt-2"
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2 rounded-xl bg-paper-2 px-3 py-2.5 text-[0.81rem] text-ink-70">
        <Icon name="info" size="sm" className="mt-0.5 shrink-0" />
        <span>{listing.note}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {down ? (
          <>
            <ActionButton
              type="button"
              variant="line"
              size="sm"
              disabled={!canTakedown}
              onClick={() => onRestore(listing.id)}
            >
              <Icon name="undo" size="sm" />
              Restore
            </ActionButton>
            <ActionButton type="button" variant="line" size="sm" asChild>
              <Link href={`/console/people/${listing.sellerId}`}>
                Open the seller
              </Link>
            </ActionButton>
          </>
        ) : (
          <>
            <ActionButton
              type="button"
              variant="clay"
              size="sm"
              disabled={!canTakedown}
              onClick={() => onTakedown(listing.id)}
            >
              Take down
            </ActionButton>
            <ActionButton
              type="button"
              variant="line"
              size="sm"
              onClick={() => onKeep(listing.id)}
            >
              Keep it up
            </ActionButton>
            <ActionButton type="button" variant="line" size="sm" asChild>
              <Link href={`/console/people/${listing.sellerId}`}>
                Open the seller
              </Link>
            </ActionButton>
          </>
        )}
      </div>
    </div>
  );
}

type ListingFiltersProps = {
  active: string;
  counts: Record<string, number>;
  keys: readonly { key: string; label: string }[];
  className?: string;
};

export function ListingFilters({
  active,
  counts,
  keys,
  className,
}: ListingFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label="Filter listings"
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
              if (key !== "reported") params.set("filter", key);
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
