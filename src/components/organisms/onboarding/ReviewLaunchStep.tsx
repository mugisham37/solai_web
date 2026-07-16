"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { OnboardingLayout } from "@/components/organisms/onboarding/OnboardingLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardingDraft } from "@/hooks/use-onboarding-draft";
import { CONNECTION_ITEMS, DEMO_CONNECTED_LABELS, LAUNCH_TIMELINE, PAYMENT_RAILS } from "@/lib/onboarding/constants";
import { formatCurrencyAmount } from "@/lib/currency";
import { brandEase, prefersReducedMotion } from "@/lib/motion";

export function ReviewLaunchStep() {
  const router = useRouter();
  const { draft, launchCampaign } = useOnboardingDraft();
  const [agreed, setAgreed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [launchState, setLaunchState] = useState(draft.launch);

  const connectedProviders = CONNECTION_ITEMS.filter(
    (item) => draft.connections[item.key].status === "connected",
  );
  const idleProviders = CONNECTION_ITEMS.filter(
    (item) => draft.connections[item.key].status !== "connected",
  );
  const enabledRails = PAYMENT_RAILS.filter(
    (r) => draft.payments[r.key].enabled && draft.payments[r.key].status === "connected",
  );
  const duration = Math.ceil(draft.budget.totalCap / draft.budget.dailyCap);

  async function handleLaunch() {
    startTransition(async () => {
      const launch = await launchCampaign();
      setLaunchState(launch);
    });
  }

  if (launchState.status === "success") {
    const reduced = prefersReducedMotion();
    return (
      <OnboardingLayout
        step={4}
        hideFooter
        showSave={false}
        onContinue={() => router.push("/dashboard")}
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-brand-soft text-brand">
            <Rocket className="size-12" strokeWidth={1.5} />
          </div>
          <h1 className="mb-2 text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
            You&apos;re live!
          </h1>
          <p className="mx-auto mb-8 max-w-[560px] text-[15px] text-text-muted">
            SolAI is building your first campaign now. Your first ads will
            appear within 30 minutes.
          </p>
          <div className="mx-auto max-w-[480px] text-left">
            {LAUNCH_TIMELINE.map((row, i) => (
              <motion.div
                key={row.time}
                initial={reduced ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduced ? 0 : i * 0.12, ease: brandEase }}
                className="flex items-start gap-3 border-b border-border py-2.5 text-sm text-text-muted last:border-b-0"
              >
                <span className="w-[60px] shrink-0 text-right font-mono text-xs text-text-subtle">
                  {row.time}
                </span>
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${
                    i === 0 ? "bg-success shadow-[0_0_0_3px_rgba(52,211,153,0.2)]" : "bg-border"
                  }`}
                />
                <span>{row.msg}</span>
              </motion.div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-8 inline-flex items-center rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white hover:bg-[#4A6BEE]"
          >
            Go to dashboard
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      step={4}
      nextLabel="Launch campaign"
      nextDisabled={!agreed || pending}
      onContinue={handleLaunch}
    >
      <h1 className="mb-1.5 text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
        Review & launch
      </h1>
      <p className="mb-7 max-w-[560px] text-[15px] text-text-muted">
        Confirm everything looks right before SolAI starts working.
      </p>

      {launchState.status === "failed" && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
          {launchState.errorReason}
          <button
            type="button"
            onClick={handleLaunch}
            className="ml-2 underline"
          >
            Retry launch
          </button>
        </div>
      )}

      <div className="space-y-3">
        <ReviewCard title="Connections" editHref="/onboarding/connections">
          {connectedProviders.map((item) => (
            <ReviewRow
              key={item.key}
              connected
              label={DEMO_CONNECTED_LABELS[item.key] ?? `${item.label} — Connected`}
            />
          ))}
          {idleProviders.map((item) => (
            <ReviewRow
              key={item.key}
              connected={false}
              label={`${item.label} — Not connected`}
            />
          ))}
        </ReviewCard>

        <ReviewCard title="Payment Rails" editHref="/onboarding/payments">
          {enabledRails.map((rail) => (
            <ReviewRow
              key={rail.key}
              connected
              label={
                rail.key === "stripe"
                  ? "Stripe — acct_1N…7xQ"
                  : `${rail.label} — ${draft.payments[rail.key].merchantId}`
              }
            />
          ))}
        </ReviewCard>

        <ReviewCard title="Product" editHref="/onboarding/product-budget">
          <div>
            <strong className="block text-[15px] text-text">
              {draft.product.name}
            </strong>
            <p className="mt-1 text-[13px] text-text-muted">
              {draft.product.currency} {draft.product.price} · {draft.product.description.slice(0, 80)}
              {draft.product.description.length > 80 ? "…" : ""}
            </p>
            <p className="mt-1 text-xs text-text-subtle">
              Target: {draft.audience.idealCustomer.slice(0, 60)}… ·{" "}
              {draft.audience.languages.join(", ")}
            </p>
          </div>
        </ReviewCard>

        <ReviewCard title="Budget" editHref="/onboarding/product-budget">
          <div className="grid grid-cols-3 gap-3">
            <BudgetStat
              label="Daily cap"
              value={formatCurrencyAmount(
                draft.budget.dailyCap,
                draft.budget.currency,
              )}
            />
            <BudgetStat
              label="Total cap"
              value={formatCurrencyAmount(
                draft.budget.totalCap,
                draft.budget.currency,
              )}
            />
            <BudgetStat label="Duration" value={`~${duration} days`} />
          </div>
        </ReviewCard>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <label className="flex cursor-pointer items-start gap-2.5 text-[13px] text-text-muted">
          <Checkbox
            checked={agreed}
            onCheckedChange={(v) => setAgreed(Boolean(v))}
            className="mt-0.5"
          />
          <span>
            I authorise SolAI to spend up to{" "}
            <strong className="text-text">
              {formatCurrencyAmount(draft.budget.dailyCap, draft.budget.currency)}
              /day
            </strong>{" "}
            (max{" "}
            <strong className="text-text">
              {formatCurrencyAmount(draft.budget.totalCap, draft.budget.currency)}
            </strong>{" "}
            total) on my linked Meta ad account. I understand this is a{" "}
            <strong className="text-text">hard cap</strong> that cannot be
            exceeded. I have read the{" "}
            <span className="text-text-muted/50" aria-disabled="true">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-text-muted/50" aria-disabled="true">
              Data Processing Agreement
            </span>
            .
          </span>
        </label>
      </div>
    </OnboardingLayout>
  );
}

function ReviewCard({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text">{title}</h4>
        <Link
          href={editHref}
          className="text-xs font-medium text-brand no-underline hover:underline"
        >
          Edit
        </Link>
      </div>
      {children}
    </div>
  );
}

function ReviewRow({
  connected,
  label,
}: {
  connected: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 py-1 text-[13px] text-text-muted">
      <span
        className={`size-1.5 rounded-full ${
          connected ? "bg-success" : "bg-text-subtle"
        }`}
        aria-hidden
      />
      {label}
    </div>
  );
}

function BudgetStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-bg px-3 py-3 text-center">
      <span className="block text-xs text-text-subtle">{label}</span>
      <strong className="tnum mt-0.5 block font-mono text-base text-text">
        {value}
      </strong>
    </div>
  );
}
