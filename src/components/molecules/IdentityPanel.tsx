import { MaskedValue } from "@/components/atoms/MaskedValue";
import { cn } from "@/lib/cn";
import type { ConsolePerson } from "@/types/console";

type IdentityPanelProps = {
  person: ConsolePerson;
  canUnmask: boolean;
  className?: string;
};

export function IdentityPanel({
  person,
  canUnmask,
  className,
}: IdentityPanelProps) {
  return (
    <div className={cn("rounded-card border border-hair bg-white p-4", className)}>
      <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
        Identity
      </p>
      <div className="grid gap-4 @[700px]:grid-cols-2">
        <div className="flex flex-col divide-y divide-dashed divide-hair">
          <MaskedValue
            personId={person.id}
            field="phone"
            masked={person.phoneMasked}
            canUnmask={canUnmask}
            label="Phone (account)"
          />
          <MaskedValue
            personId={person.id}
            field="wallet"
            masked={person.walletMasked}
            canUnmask={canUnmask}
            label="Payout wallet"
          />
          <MaskedValue
            personId={person.id}
            field="holder"
            masked={person.holderMasked}
            canUnmask={canUnmask}
            label="Registered name"
          />
        </div>
        <div className="flex flex-col text-sm">
          <div className="flex justify-between gap-3 border-b border-dashed border-hair py-1.5">
            <span className="text-ink-70">Orders</span>
            <span className="font-bold">{person.orders}</span>
          </div>
          <div className="flex justify-between gap-3 border-b border-dashed border-hair py-1.5">
            <span className="text-ink-70">Delivered and confirmed</span>
            <span className="font-bold">
              {person.delivered} of {person.orders}
            </span>
          </div>
          <div className="flex justify-between gap-3 py-1.5">
            <span className="text-ink-70">Disputes</span>
            <span className="font-bold">
              {person.disputes} · {person.upheld} upheld
            </span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[0.74rem] text-ink-45">
        {canUnmask
          ? "Unmasking is logged with your name and a reason, and retained for 90 days."
          : "Your role cannot unmask. Finance can, with a logged reason."}
      </p>
    </div>
  );
}
