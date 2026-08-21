"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PanelErrorBoundary } from "@/components/build/PanelErrorBoundary";
import { PrintablePoster } from "@/components/molecules/PrintablePoster";
import { LiveActionBar } from "@/components/organisms/LiveActionBar";
import { LiveState } from "@/components/organisms/LiveState";
import { LiveTopBar } from "@/components/organisms/LiveTopBar";
import { PublishErrorState } from "@/components/organisms/PublishErrorState";
import { PublishingState } from "@/components/organisms/PublishingState";
import { QrSheet } from "@/components/organisms/QrSheet";
import { SlugSheet } from "@/components/organisms/SlugSheet";
import { ToastProvider, useToastContext } from "@/components/providers/ToastProvider";
import { BUILD_STEPS } from "@/data/build";
import { useLiveState } from "@/hooks/useLiveState";
import { inAppShopPath } from "@/lib/buyer/paths";
import { LIVE_PROGRESS } from "@/lib/live-reducer";

/** Display host for the link. The canonical absolute URL comes from the server. */
const DISPLAY_HOST = "solai.shop/";

type LiveShellProps = {
  draftId: string;
};

export function LiveShell({ draftId }: LiveShellProps) {
  return (
    <ToastProvider>
      <LiveShellInner draftId={draftId} />
    </ToastProvider>
  );
}

function LiveShellInner({ draftId }: LiveShellProps) {
  const t = useTranslations("live");
  const tCommon = useTranslations("common");
  /** `BUILD_STEPS` carries fully-qualified keys, so the step labels resolve from the root. */
  const tRoot = useTranslations();
  const locale = useLocale();
  const { toast } = useToastContext();

  const { liveState, dispatch, retryPublish } = useLiveState(draftId);
  const [slugOpen, setSlugOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const stepLabels = useMemo(
    () => Object.fromEntries(BUILD_STEPS.map((step) => [step.labelKey, tRoot(step.labelKey)])),
    [tRoot],
  );

  const stepperLabels = useMemo(
    () => ({
      nav: tCommon("progressNav"),
      done: tCommon("stepDone"),
      current: tCommon("stepCurrent"),
    }),
    [tCommon],
  );

  const summary = liveState.state === "live" ? liveState.summary : null;

  const handleSlugSaved = useCallback(
    (slug: string, shopUrl: string) => {
      // One dispatch updates the link bar, the QR, the sheet and the poster,
      // because they all read the same summary.
      dispatch({ type: "UPDATE_SLUG", slug, shopUrl });
    },
    [dispatch],
  );

  return (
    /* `data-print-root` is the anchor the print stylesheet keeps; everything
       inside it except the poster is hidden when printing. */
    <div
      data-print-root
      className="build-app-shell mx-auto flex min-h-screen w-full max-w-[1440px] flex-col bg-paper"
    >
      <LiveTopBar
        activeStep={4}
        stepLabels={stepLabels}
        stepperLabels={stepperLabels}
        backHref={`/build/${draftId}/payout?screen=done`}
        backLabel={t("topbar.back")}
        liveChip={summary ? t("topbar.liveChip") : undefined}
        progressPct={LIVE_PROGRESS[liveState.state]}
      />

      <PanelErrorBoundary retryLabel={t("error.retry")} title={t("error.panel")}>
        {liveState.state === "publishing" ? (
          <PublishingState t={t} stages={liveState.stages} progress={liveState.progress} />
        ) : null}

        {liveState.state === "live" ? (
          <LiveState
            t={t}
            tRich={(key) =>
              t.rich(key, {
                highlight: (chunks) => <span className="mark-line">{chunks}</span>,
                strong: (chunks) => <span className="font-bold text-ink">{chunks}</span>,
                shopName: liveState.summary.shopName,
              })
            }
            locale={locale}
            summary={liveState.summary}
            host={DISPLAY_HOST}
            storefrontHref={inAppShopPath(liveState.summary.shopSlug)}
            onToast={toast}
            onChangeLink={() => setSlugOpen(true)}
            onEnlargeQr={() => setQrOpen(true)}
          />
        ) : null}

        {liveState.state === "error" ? (
          <PublishErrorState
            t={t}
            message={liveState.message}
            backHref={`/build/${draftId}?screen=draft`}
            onRetry={() => void retryPublish()}
          />
        ) : null}
      </PanelErrorBoundary>

      {summary ? (
        <LiveActionBar
          hint={t("action.hint")}
          ctaLabel={t("action.shareCta")}
          shareHref={`/build/${draftId}/share`}
        />
      ) : null}

      {summary ? (
        <>
          <SlugSheet
            open={slugOpen}
            onOpenChange={setSlugOpen}
            t={t}
            draftId={draftId}
            currentSlug={summary.shopSlug}
            host={DISPLAY_HOST}
            onSaved={handleSlugSaved}
            onToast={toast}
          />

          <QrSheet
            open={qrOpen}
            onOpenChange={setQrOpen}
            t={t}
            shopUrl={summary.shopUrl}
            slug={summary.shopSlug}
            host={DISPLAY_HOST}
            onToast={toast}
          />

          <PrintablePoster
            shopName={summary.shopName}
            linkText={`${DISPLAY_HOST}${summary.shopSlug}`}
            shopUrl={summary.shopUrl}
            buyFromLabel={t("poster.buyFrom")}
            scanPrompt={t("poster.scanPrompt")}
            paymentNote={t("poster.paymentNote")}
            protectionNote={t("poster.protectionNote")}
          />
        </>
      ) : null}
    </div>
  );
}
