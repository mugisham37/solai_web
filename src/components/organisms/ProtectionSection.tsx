"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { PhoneMock } from "@/components/art/PhoneMock";
import { StageOption } from "@/components/molecules/StageOption";
import {
  protectionMockOrder,
  protectionSectionKeys,
  protectionSideTiles,
  protectionStages,
} from "@/data/protection";
import type { EscrowStageIndex } from "@/types/escrow";
import { STEPPER_AUTO_MS } from "@/lib/motion";
import { ScrollReveal } from "@/components/providers/ScrollReveal";

export function ProtectionSection() {
  const t = useTranslations();
  const locale = useLocale();
  const [stage, setStage] = useState<EscrowStageIndex>(1);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interacted = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const panelId = useId();

  const selectStage = useCallback((index: EscrowStageIndex, manual = false) => {
    setStage(index);
    if (manual) {
      interacted.current = true;
      if (autoRef.current) {
        clearInterval(autoRef.current);
        autoRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!section || reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !interacted.current && !autoRef.current) {
            selectStage(0);
            autoRef.current = setInterval(() => {
              setStage((prev) => ((prev + 1) % 4) as EscrowStageIndex);
            }, STEPPER_AUTO_MS);
          } else if (!entry.isIntersecting && autoRef.current) {
            clearInterval(autoRef.current);
            autoRef.current = null;
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(section);
    return () => {
      io.disconnect();
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [selectStage]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectStage(Math.min(3, stage + 1) as EscrowStageIndex, true);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectStage(Math.max(0, stage - 1) as EscrowStageIndex, true);
    }
  };

  const current = protectionStages[stage];

  return (
    <section ref={sectionRef} id="protection" className="section-y bg-deep text-on-deep">
      <div className="mx-auto max-w-[1180px] px-[1.15rem] md:px-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-14">
        <div>
          <Eyebrow variant="accent" onDark>
            {t(protectionSectionKeys.eyebrowKey)}
          </Eyebrow>
          <Heading level={2} size="h2" surface="dark" className="mt-3 max-w-[18ch]">
            {t(protectionSectionKeys.titleKey)}
          </Heading>
          <Text size="body-large" surface="dark" className="mt-3 max-w-[52ch]">
            {t(protectionSectionKeys.ledeKey)}
          </Text>
          <div
            className="mt-6 flex flex-col gap-2"
            role="tablist"
            aria-label={t(protectionSectionKeys.tablistLabelKey)}
            onKeyDown={onKeyDown}
          >
            {protectionStages.map((item) => (
              <StageOption
                key={item.id}
                id={`${panelId}-tab-${item.index}`}
                controlsId={panelId}
                index={item.index}
                title={t(item.titleKey)}
                body={t(item.bodyKey)}
                isCurrent={stage === item.index}
                onSelect={() => selectStage(item.index, true)}
              />
            ))}
          </div>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {protectionSideTiles.map((tile) => (
              <div
                key={tile.id}
                className="rounded-tile border border-deep-hair bg-white/10 p-3"
              >
                <p className="text-[0.96rem] font-bold text-on-deep">{t(tile.titleKey)}</p>
                <Text size="tiny" surface="dark">
                  {t(tile.bodyKey)}
                </Text>
              </div>
            ))}
          </div>
        </div>
        <ScrollReveal className="mt-8 lg:mt-0">
          {current ? (
            <>
              <PhoneMock
                stage={stage}
                barLabel={t(protectionMockOrder.barKey)}
                orderLabel={t(protectionMockOrder.orderLabelKey)}
                chipLabel={t(current.mockChipKey)}
                chipVariant={current.mockChipVariant}
                panelId={panelId}
                locale={locale}
              />
              <Text size="tiny" surface="dark" className="mt-3 text-center">
                {t(protectionMockOrder.hintKey)}
              </Text>
            </>
          ) : null}
        </ScrollReveal>
      </div>
    </section>
  );
}
