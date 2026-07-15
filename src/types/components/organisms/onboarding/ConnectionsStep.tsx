"use client";

import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConnectionCard } from "@/components/molecules/onboarding/ConnectionCard";
import { OnboardingLayout } from "@/components/organisms/onboarding/OnboardingLayout";
import { updateConnectionsAction } from "@/lib/actions/onboarding";
import { CONNECTION_ITEMS } from "@/lib/onboarding/constants";
import type { OnboardingDraft } from "@/types/onboarding";

interface ConnectionsStepProps {
  draft: OnboardingDraft;
  bannerMessage?: string | null;
}

export function ConnectionsStep({
  draft: initialDraft,
  bannerMessage = null,
}: ConnectionsStepProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialDraft);

  const categories = [...new Set(CONNECTION_ITEMS.map((i) => i.category))];
  const hasConnection = Object.values(draft.connections).some(
    (c) => c.status === "connected",
  );

  function updateConnection(
    provider: keyof OnboardingDraft["connections"],
    state: OnboardingDraft["connections"][typeof provider],
  ) {
    setDraft((d) => ({
      ...d,
      connections: { ...d.connections, [provider]: state },
    }));
  }

  async function handleContinue() {
    await updateConnectionsAction(draft.connections, 2);
    router.push("/onboarding/payments");
  }

  return (
    <OnboardingLayout step={1} onContinue={handleContinue}>
      <h1 className="mb-1.5 text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Connect your accounts
      </h1>
      <p className="mb-7 max-w-[560px] text-[15px] text-text-muted">
        Link your store and ad platforms. SolAI uses OAuth — we never see your
        passwords.
      </p>

      {bannerMessage && (
        <div className="mb-4 rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-text-muted">
          {bannerMessage}
        </div>
      )}

      {!hasConnection && (
        <div className="mb-4 rounded-md border border-warning/30 bg-warning/5 px-3.5 py-2.5 text-sm text-text-muted">
          SolAI can&apos;t launch campaigns until you connect at least one
          platform — you can do this later.
        </div>
      )}

      {categories.map((cat) => (
        <section key={cat} className="mb-6">
          <h3 className="mb-3 font-mono text-[11px] font-medium tracking-[0.08em] text-brand uppercase">
            {cat}
          </h3>
          <div className="flex flex-col gap-2">
            {CONNECTION_ITEMS.filter((i) => i.category === cat).map((item) => (
              <ConnectionCard
                key={item.key}
                provider={item.key}
                icon={item.icon as "store" | "users" | "target" | "messageCircle"}
                label={item.label}
                desc={item.desc}
                state={draft.connections[item.key]}
                onUpdate={updateConnection}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-start gap-2 rounded-md border border-border bg-surface px-3.5 py-3 text-[13px] text-text-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-info" />
        <span>
          You can connect more platforms later in Settings → Integrations.
        </span>
      </div>
    </OnboardingLayout>
  );
}
