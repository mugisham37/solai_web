import { Icon } from "@/components/atoms/Icon";
import { Lockbar } from "@/components/atoms/Lockbar";
import { StatusChip } from "@/components/atoms/StatusChip";
import { RuleRow } from "@/components/molecules/RuleRow";
import { can } from "@/lib/console/permissions";
import type { ConsoleAgent, MarketRules } from "@/types/console";

const MARKET_NAMES: Record<string, string> = {
  RW: "Rwanda",
  UG: "Uganda",
  KE: "Kenya",
  TZ: "Tanzania",
};

type RulesViewProps = {
  rules: readonly MarketRules[];
  agent: ConsoleAgent;
};

export function RulesView({ rules, agent }: RulesViewProps) {
  const canEdit = can(agent.role, "rules");
  const rwanda = rules.find((r) => r.market === "RW");
  const others = rules.filter((r) => r.market !== "RW");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
            Rules
          </h1>
          <p className="mt-1 max-w-[52ch] text-[0.74rem] text-ink-45">
            Hold windows and limits are configuration per market, never
            constants in code — the law differs by country and it changes.
          </p>
        </div>
        <StatusChip
          label={canEdit ? "Editable" : "Administrator only"}
          tone={canEdit ? "live" : "clay"}
        />
      </div>

      {!canEdit ? (
        <div className="flex gap-2 rounded-xl border border-clay/30 bg-clay/[0.07] px-3.5 py-3 text-[0.81rem] text-clay">
          <Icon name="lock" size="sm" className="mt-0.5 shrink-0" />
          <span>
            Your role can read these but not change them. Switch to
            Administrator in the top bar to see the editable version.
          </span>
        </div>
      ) : null}

      <div className="grid gap-5 @[1000px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)] @[1000px]:items-start">
        <div className="flex flex-col gap-3">
          {rwanda ? (
            <div className="rounded-card border border-hair bg-white p-4">
              <p className="mb-4 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
                Rwanda · v{rwanda.version}
              </p>
              <RuleRow market={rwanda} locked={!canEdit} />
            </div>
          ) : null}

          <div className="flex gap-2 rounded-xl bg-paper-2 px-3.5 py-3 text-[0.81rem] text-ink-70">
            <Icon name="info" size="sm" className="mt-0.5 shrink-0" />
            <span>
              Changing a rule never applies retroactively. Orders already placed
              keep the terms they were created under, and the ledger records
              which rule version applied.
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 @[1000px]:sticky @[1000px]:top-[4.6rem]">
          <div className="rounded-card border border-hair bg-white p-4">
            <p className="mb-3 font-display text-[0.64rem] font-bold tracking-[0.14em] text-ink-45 uppercase">
              Other markets
            </p>
            <div className="flex flex-col text-sm">
              {others.map((m) => (
                <div
                  key={m.market}
                  className="flex items-center justify-between gap-3 border-b border-dashed border-hair py-2 last:border-b-0"
                >
                  <span>{MARKET_NAMES[m.market] ?? m.market}</span>
                  <StatusChip
                    label={m.live ? "Live" : "Not live"}
                    tone="line"
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.74rem] text-ink-45">
              Each market gets its own row here rather than inheriting Rwanda’s
              numbers. That is the whole reason these are configuration.
            </p>
          </div>

          <Lockbar icon="scale">
            Holding third-party funds is regulated in every market on this
            list. Keep escrow in a partner-held trust account, never
            commingled with operating money.
          </Lockbar>
        </div>
      </div>
    </div>
  );
}
