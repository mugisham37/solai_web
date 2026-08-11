"use client";

import { useState, useTransition } from "react";
import { setWatchFlagAction } from "@/app/actions/console/person";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { StatusChip } from "@/components/atoms/StatusChip";
import { EvidenceTimeline } from "@/components/molecules/EvidenceTimeline";
import { GraduatedControlsPanel } from "@/components/molecules/GraduatedControls";
import { IdentityPanel } from "@/components/molecules/IdentityPanel";
import { MoneyPanel } from "@/components/molecules/MoneyPanel";
import { SuspendDialog } from "@/components/molecules/SuspendDialog";
import { can } from "@/lib/console/permissions";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useRouter } from "@/i18n/navigation";
import type { ConsoleAgent, ConsolePerson } from "@/types/console";

type PersonFileViewProps = {
  person: ConsolePerson;
  agent: ConsoleAgent;
  locale: string;
};

export function PersonFileView({
  person,
  agent,
  locale,
}: PersonFileViewProps) {
  const { toast } = useToastContext();
  const router = useRouter();
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const canUnmask = can(agent.role, "unmask");
  const canSuspend = can(agent.role, "suspend");
  const suspended = person.status === "suspended";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
            {person.name}
          </h1>
          <p className="mt-1 text-[0.74rem] text-ink-45">
            {person.kind === "seller" ? "Seller" : "Buyer"} · {person.id} ·
            since {person.since} · {person.city}
          </p>
        </div>
        <StatusChip
          label={
            person.status === "active"
              ? "Active"
              : person.status === "watch"
                ? "Watched"
                : "Suspended"
          }
          tone={
            person.status === "active"
              ? "live"
              : person.status === "watch"
                ? "held"
                : "clay"
          }
        />
      </div>

      {person.flags.length ? (
        <div className="flex gap-2 rounded-xl border border-clay/30 bg-clay/[0.07] px-3.5 py-3 text-[0.81rem] text-clay">
          <Icon name="alert" size="sm" className="mt-0.5 shrink-0" />
          <span>
            <span className="font-bold">Flagged:</span>{" "}
            {person.flags.join(" · ")}
          </span>
        </div>
      ) : null}

      {/* File left, controls right on desktop; controls last on phone */}
      <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(300px,0.82fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3">
          <IdentityPanel person={person} canUnmask={canUnmask} />
          <MoneyPanel
            held={person.held}
            reserve={person.reserve}
            paid={person.paid}
            locale={locale}
          />
          {person.activity.length ? (
            <div className="rounded-card border border-hair bg-white p-4">
              <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
                Recent activity
              </p>
              <EvidenceTimeline events={person.activity} />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 @[1000px]:sticky @[1000px]:top-[4.6rem]">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Controls
            </p>
            <GraduatedControlsPanel
              personId={person.id}
              controls={person.controls}
            />
            <hr className="my-4 border-0 border-t border-hair" />
            <div className="flex flex-col gap-2">
              <ActionButton
                type="button"
                variant="line"
                size="sm"
                block
                disabled={pending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await setWatchFlagAction(
                      person.id,
                      "Manual watch",
                    );
                    toast(
                      result.ok
                        ? "Watch flag added and logged"
                        : "Could not add flag",
                    );
                    if (result.ok) router.refresh();
                  });
                }}
              >
                <Icon name="flag" size="sm" />
                Add a watch flag
              </ActionButton>
              <ActionButton
                type="button"
                variant="clay"
                size="sm"
                block
                disabled={!canSuspend}
                onClick={() => setSuspendOpen(true)}
              >
                <Icon name="ban" size="sm" />
                {suspended
                  ? "Reinstate this account"
                  : "Suspend this account"}
              </ActionButton>
            </div>
            <p className="mt-3 text-[0.74rem] text-ink-45">
              {canSuspend
                ? "Suspending stops new orders. It never touches money already held — buyers in flight are still refunded or released by the normal rules."
                : "Only an administrator can suspend. Graduated controls above are available to you."}
            </p>
          </div>

          <div className="rounded-card bg-paper-2 p-4">
            <p className="m-0 mb-1.5 text-[0.92rem] font-bold">
              Graduated, not binary
            </p>
            <p className="m-0 text-[0.74rem] text-ink-45">
              The honest answer to most risk signals is “slow this account
              down”, not “destroy it”. That is why there are four switches
              before there is a ban.
            </p>
          </div>
        </div>
      </div>

      <SuspendDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        personId={person.id}
        personName={person.name}
        suspended={suspended}
      />
    </div>
  );
}
