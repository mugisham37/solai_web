"use client";

import {
  CreditCard,
  Globe,
  Link2,
  Rocket,
  Shield,
  Target,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/organisms/onboarding/OnboardingLayout";
import { advanceWelcomeStep } from "@/lib/actions/onboarding";

const WELCOME_CARDS = [
  {
    icon: Link2,
    title: "Connect your store & ad accounts",
    desc: "OAuth into Shopify or WooCommerce, then link Meta and Google Ads.",
  },
  {
    icon: CreditCard,
    title: "Set up payment rails",
    desc: "Connect Stripe and/or Mobile Money so customers can pay.",
  },
  {
    icon: Target,
    title: "Describe your product & audience",
    desc: "Tell SolAI what you sell, who buys it, and your daily budget.",
  },
  {
    icon: Rocket,
    title: "Review & launch",
    desc: "Confirm everything, agree to spend caps, and let SolAI build your first campaign.",
  },
] as const;

export function WelcomeStep() {
  const router = useRouter();

  async function handleContinue() {
    await advanceWelcomeStep();
    router.push("/onboarding/connections");
  }

  return (
    <OnboardingLayout
      step={0}
      nextLabel="Let's go"
      showSave={false}
      onContinue={handleContinue}
    >
      <div className="text-center">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Rocket className="size-10" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] text-text">
          Welcome to SolAI
        </h1>
        <p className="mx-auto mb-8 max-w-[560px] text-[15px] text-text-muted">
          You&apos;re about 5 minutes away from your first autonomous campaign.
          Here&apos;s what we&apos;ll set up:
        </p>
        <div className="mb-7 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
          {WELCOME_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex gap-3 rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                <card.icon className="size-5" strokeWidth={1.5} />
              </div>
              <div>
                <strong className="block text-sm text-text">{card.title}</strong>
                <p className="mt-0.5 text-[13px] text-text-muted">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-surface p-4 text-left">
          <div className="flex items-center gap-2 text-[13px] text-text-muted">
            <Shield className="size-4 shrink-0 text-brand" />
            Hard spend caps — SolAI can never exceed your limit
          </div>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-text-muted">
            <Zap className="size-4 shrink-0 text-brand" />
            Every decision explained with a &ldquo;Why?&rdquo; button
          </div>
          <div className="mt-2 flex items-center gap-2 text-[13px] text-text-muted">
            <Globe className="size-4 shrink-0 text-brand" />
            Data stored in AWS af-south-1 (Cape Town)
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
