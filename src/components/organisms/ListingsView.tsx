"use client";

import { useState, useTransition } from "react";
import {
  keepListingAction,
  restoreListingAction,
} from "@/app/actions/console/listing";
import {
  ListingCard,
  ListingFilters,
} from "@/components/molecules/ListingCard";
import {
  TakedownConsequences,
  TakedownDialog,
} from "@/components/molecules/TakedownConsequences";
import { ReasonCodePicker } from "@/components/molecules/ReasonCodePicker";
import { StatusChip } from "@/components/atoms/StatusChip";
import { Icon } from "@/components/atoms/Icon";
import { can } from "@/lib/console/permissions";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useRouter } from "@/i18n/navigation";
import type { ConsoleAgent, ListingListResult } from "@/types/console";

const FILTER_KEYS = [
  { key: "reported", label: "Reported" },
  { key: "appeal", label: "Appeals" },
  { key: "down", label: "Taken down" },
  { key: "all", label: "All" },
] as const;

type ListingsViewProps = {
  data: ListingListResult;
  filter: string;
  agent: ConsoleAgent;
  locale: string;
};

export function ListingsView({
  data,
  filter,
  agent,
  locale,
}: ListingsViewProps) {
  const { toast } = useToastContext();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [takedownId, setTakedownId] = useState<string | null>(null);
  const canTakedown = can(agent.role, "takedown");
  const activeListing = data.rows.find((l) => l.id === takedownId);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
          Listings
        </h1>
        <p className="mt-1 max-w-[52ch] text-[0.74rem] text-ink-45">
          Moderation is a payments problem too — every takedown asks what
          happens to money already collected.
        </p>
      </div>

      <ListingFilters
        active={filter}
        counts={data.counts}
        keys={[...FILTER_KEYS]}
      />

      <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3">
          {data.rows.length ? (
            <div className="grid gap-3 @[700px]:grid-cols-2">
              {data.rows.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  locale={locale}
                  canTakedown={canTakedown}
                  onTakedown={(id) => setTakedownId(id)}
                  onKeep={(id) => {
                    startTransition(async () => {
                      const result = await keepListingAction(id);
                      toast(
                        result.ok
                          ? "Listing kept · report cleared"
                          : "Could not keep listing",
                      );
                      if (result.ok) router.refresh();
                    });
                  }}
                  onRestore={(id) => {
                    startTransition(async () => {
                      const result = await restoreListingAction(id);
                      toast(
                        result.ok
                          ? "Listing restored"
                          : result.error === "forbidden"
                            ? "Your role cannot restore"
                            : "Could not restore",
                      );
                      if (result.ok) router.refresh();
                    });
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-card border border-hair bg-white px-6 py-12 text-center">
              <Icon name="image" size="lg" className="text-ink-45" />
              <p className="mt-3 font-display text-d3 font-bold">Nothing here</p>
              <p className="mt-1 max-w-[34ch] text-sm text-ink-70">
                No listings in this queue. That is the state you want.
              </p>
            </div>
          )}

          <TakedownConsequences />
        </div>

        <div className="flex flex-col gap-3 @[1000px]:sticky @[1000px]:top-[4.6rem]">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Reason, always sent to the seller
            </p>
            <ReasonCodePicker
              options={[
                {
                  key: "counterfeit",
                  label: "Counterfeit or unlicensed brand",
                },
                { key: "prohibited", label: "Prohibited item or claim" },
                { key: "misleading", label: "Misleading photos or price" },
                { key: "stolenPhotos", label: "Someone else’s photos" },
              ]}
              value="counterfeit"
              onChange={() => {
                /* selection used in takedown dialog */
              }}
              label=""
            />
            <p className="mt-3 text-[0.74rem] text-ink-45">
              Written in the seller’s language with the exact rule and a
              one-tap appeal. Silent removals lose honest sellers along with
              dishonest ones.
            </p>
          </div>

          <div className="rounded-card bg-paper-2 p-4">
            <p className="mb-2 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              WhatsApp channel health
            </p>
            <div className="flex flex-col text-sm">
              <div className="flex justify-between gap-3 border-b border-dashed border-hair py-1.5">
                <span className="text-ink-70">Spam complaints · 7d</span>
                <span className="font-bold">
                  {data.whatsappHealth.spamComplaints7d}
                </span>
              </div>
              <div className="flex justify-between gap-3 border-b border-dashed border-hair py-1.5">
                <span className="text-ink-70">Template quality rating</span>
                <StatusChip
                  label={data.whatsappHealth.templateRating}
                  tone="live"
                />
              </div>
              <div className="flex justify-between gap-3 py-1.5">
                <span className="text-ink-70">Numbers at risk of block</span>
                <span className="font-bold">
                  {data.whatsappHealth.numbersAtRisk}
                </span>
              </div>
            </div>
            <p className="mt-2 text-[0.74rem] text-ink-45">
              Meta blocks a whole business number for bad ratings. One seller
              spamming can take every catalogue offline, so this is monitored
              per seller and throttled here.
            </p>
          </div>
        </div>
      </div>

      <TakedownDialog
        open={!!takedownId}
        onOpenChange={(open) => {
          if (!open) setTakedownId(null);
        }}
        listingId={takedownId}
        listingTitle={activeListing?.title}
      />

      {pending ? (
        <span className="sr-only" aria-live="polite">
          Updating listing
        </span>
      ) : null}
    </div>
  );
}
