"use client";

import { useState, useTransition } from "react";
import { takedownListingAction } from "@/app/actions/console/listing";
import { ActionButton } from "@/components/atoms/ActionButton";
import { StatusChip } from "@/components/atoms/StatusChip";
import { ReasonCodePicker } from "@/components/molecules/ReasonCodePicker";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { ListingTakedownReason } from "@/types/console";

const REASONS: readonly { key: ListingTakedownReason; label: string }[] = [
  { key: "counterfeit", label: "Counterfeit or unlicensed brand" },
  { key: "prohibited", label: "Prohibited item or claim" },
  { key: "misleading", label: "Misleading photos or price" },
  { key: "stolenPhotos", label: "Someone else’s photos" },
];

type TakedownConsequencesProps = {
  className?: string;
};

export function TakedownConsequences({ className }: TakedownConsequencesProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-hair bg-white p-4",
        className,
      )}
    >
      <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
        A takedown does four things at once
      </p>
      <div className="grid gap-2 @[700px]:grid-cols-2">
        <div className="flex justify-between gap-2 border-b border-dashed border-hair py-1.5 text-sm">
          <span className="text-ink-70">Storefront listing</span>
          <StatusChip label="Hidden" tone="clay" />
        </div>
        <div className="flex justify-between gap-2 border-b border-dashed border-hair py-1.5 text-sm">
          <span className="text-ink-70">WhatsApp catalogue item</span>
          <StatusChip label="Withdrawn" tone="clay" />
        </div>
        <div className="flex justify-between gap-2 border-b border-dashed border-hair py-1.5 text-sm">
          <span className="text-ink-70">Ads pointing at it</span>
          <StatusChip label="Paused, budget refunded" tone="clay" />
        </div>
        <div className="flex justify-between gap-2 py-1.5 text-sm">
          <span className="text-ink-70">Orders already paid for</span>
          <StatusChip label="Held, refundable" tone="held" />
        </div>
      </div>
      <p className="mt-3 text-[0.74rem] text-ink-45">
        A takedown that leaves the product live in WhatsApp is not a takedown.
        The catalogue is a synced surface, so moderation has to reach it.
      </p>
    </div>
  );
}

type TakedownDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string | null;
  listingTitle?: string;
};

export function TakedownDialog({
  open,
  onOpenChange,
  listingId,
  listingTitle,
}: TakedownDialogProps) {
  const { toast } = useToastContext();
  const router = useRouter();
  const [reason, setReason] = useState<ListingTakedownReason>("counterfeit");
  const [pending, startTransition] = useTransition();

  const confirm = () => {
    if (!listingId) return;
    startTransition(async () => {
      const result = await takedownListingAction(listingId, reason);
      if (!result.ok) {
        toast(
          result.error === "forbidden"
            ? "Your role cannot take listings down"
            : "Could not take down listing",
        );
        return;
      }
      toast("Listing taken down · seller notified with appeal");
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="inset-auto top-1/2 left-1/2 z-[60] max-h-[90vh] w-[min(100%,460px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card bg-paper p-5 text-ink shadow-lift">
        <SheetTitle className="font-display text-d3 text-ink">
          Take down{listingTitle ? ` “${listingTitle}”` : ""}?
        </SheetTitle>
        <SheetDescription className="mt-2 text-sm text-ink-70">
          This hides the storefront listing, withdraws the WhatsApp catalogue
          item, pauses ads (budget refunded), and holds paid orders as
          refundable. The seller receives the rule in their language with a
          one-tap appeal.
        </SheetDescription>
        <div className="mt-4">
          <ReasonCodePicker
            label="Reason, always sent to the seller"
            options={REASONS}
            value={reason}
            onChange={(v) => setReason(v as ListingTakedownReason)}
          />
        </div>
        <TakedownConsequences className="mt-4" />
        <div className="mt-5 flex flex-wrap gap-2">
          <ActionButton
            type="button"
            variant="clay"
            size="sm"
            disabled={pending || !listingId}
            aria-label={`Confirm takedown of ${listingTitle ?? "listing"}. Storefront hidden, WhatsApp withdrawn, ads paused, orders held.`}
            onClick={confirm}
          >
            Take it down
          </ActionButton>
          <SheetClose asChild>
            <ActionButton type="button" variant="line" size="sm">
              Cancel
            </ActionButton>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
