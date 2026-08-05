"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Chip } from "@/components/atoms/Chip";
import { MoneyDisplay } from "@/components/atoms/Money";
import { MoneyFlow } from "@/components/molecules/MoneyFlow";
import { Separator } from "@/components/ui/separator";
import { protectionMockAmounts } from "@/data/protection";
import type { EscrowStageIndex } from "@/types/escrow";
import { useTranslations } from "next-intl";

type PhoneMockProps = {
  stage: EscrowStageIndex;
  barLabel: string;
  orderLabel: string;
  chipLabel: string;
  chipVariant: "line" | "held" | "live";
  panelId: string;
  locale: string;
};

export function PhoneMock({
  stage,
  barLabel,
  orderLabel,
  chipLabel,
  chipVariant,
  panelId,
  locale,
}: PhoneMockProps) {
  const t = useTranslations("protection.mock");
  const reduce = useReducedMotion();

  const body = (() => {
    switch (stage) {
      case 0:
        return (
          <div className="rounded-card bg-paper-2 p-3">
            <p className="text-tiny text-ink-45">{t("buyerPhone")}</p>
            <div className="mt-2 rounded-xl bg-mock-terminal p-3 font-mono text-[0.76rem] leading-relaxed text-mock-terminal-text">
              {t("buyerPrompt")}
              <br />
              <br />
              Pay <b>{formatMock(protectionMockAmounts.buyerPay, locale)}</b> to
              <br />
              <b>{t("merchant")}</b>
              <br />
              <br />
              {t("enterPin")}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="rounded-card border border-berry/30 bg-berry/5 p-3">
            <p className="text-tiny text-berry-muted">{t("heldLabel")}</p>
            <MoneyDisplay
              value={protectionMockAmounts.held}
              locale={locale}
              className="font-display text-[1.8rem] text-berry-muted"
            />
            <p className="text-tiny text-berry-muted">{t("heldNote")}</p>
          </div>
        );
      case 2:
        return (
          <div className="rounded-card border border-hair bg-white p-3 text-center">
            <p className="text-tiny text-ink-45">{t("codeIntro")}</p>
            <p className="font-display text-[2.4rem] tracking-[0.16em]">
              {protectionMockAmounts.deliveryCode}
            </p>
            <p className="text-tiny text-ink-45">{t("codeNote")}</p>
          </div>
        );
      case 3:
        return (
          <div className="rounded-card border border-sea/30 bg-sea/10 p-3 text-center">
            <p className="text-eyebrow text-sea-muted">{t("releasedEyebrow")}</p>
            <MoneyDisplay
              value={protectionMockAmounts.released}
              locale={locale}
              className="font-display text-[2rem] text-sea-deep-text"
            />
            <p className="text-tiny text-sea-deep-text">{t("releasedNote")}</p>
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <div className="mx-auto max-w-[330px] rounded-[26px] bg-white p-3.5 text-ink shadow-lift">
      <p className="pb-2 text-center text-[0.66rem] font-semibold text-ink-45">{barLabel}</p>
      <MoneyFlow variant="four" current={stage} />
      <div id={panelId} role="tabpanel" aria-live="polite" className="mt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.3, 1] }}
          >
            {body}
          </motion.div>
        </AnimatePresence>
      </div>
      <Separator className="my-3" />
      <div className="flex items-center justify-between gap-2">
        <span className="text-tiny text-ink-45">{orderLabel}</span>
        <Chip variant={chipVariant}>{chipLabel}</Chip>
      </div>
    </div>
  );
}

function formatMock(money: { amountMinor: number; currency: string }, locale: string) {
  return new Intl.NumberFormat(locale).format(money.amountMinor) + ` ${money.currency}`;
}
