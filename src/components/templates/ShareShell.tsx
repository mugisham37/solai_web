"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PanelErrorBoundary } from "@/components/build/PanelErrorBoundary";
import { InstagramHandoffSheet } from "@/components/organisms/InstagramHandoffSheet";
import { LiveTopBar } from "@/components/organisms/LiveTopBar";
import { QrSheet } from "@/components/organisms/QrSheet";
import { ShareActionBar } from "@/components/organisms/ShareActionBar";
import { ShareErrorState } from "@/components/organisms/ShareErrorState";
import { ShareState } from "@/components/organisms/ShareState";
import { SharedDoneState } from "@/components/organisms/SharedDoneState";
import { ToastProvider, useToastContext } from "@/components/providers/ToastProvider";
import { BUILD_STEPS } from "@/data/build";
import { useShareState } from "@/hooks/useShareState";
import { inAppShopPath } from "@/lib/buyer/paths";
import { formatMoney } from "@/lib/money";
import { SHARE_PROGRESS } from "@/lib/share-reducer";
import { emailSubject } from "@/lib/share/caption-data";
import {
  canShareFiles,
  emailUrl,
  facebookUrl,
  instagramUrl,
  nativeShare,
  shareFiles,
  smsUrl,
  telegramUrl,
  tweetUrl,
  whatsappUrl,
} from "@/lib/share/links";
import {
  blobToFile,
  delay,
  downloadBlob,
  packBlobs,
  storyBlob,
  PACK_DOWNLOAD_STAGGER_MS,
  type StoryRenderData,
} from "@/lib/share/story-renderer";
import { copyText } from "@/lib/clipboard";
import type { CaptionLanguage, CaptionTone, ShareChannel } from "@/types/share";

type ShareShellProps = {
  draftId: string;
};

export function ShareShell({ draftId }: ShareShellProps) {
  return (
    <ToastProvider>
      <ShareShellInner draftId={draftId} />
    </ToastProvider>
  );
}

function ShareShellInner({ draftId }: ShareShellProps) {
  const t = useTranslations("share");
  const tCommon = useTranslations("common");
  /** `BUILD_STEPS` carries fully-qualified keys, so the step labels resolve from the root. */
  const tRoot = useTranslations();
  const locale = useLocale();
  const { toast } = useToastContext();

  const { shareState, sharedChannels, sharedCount, loadSettled, dispatch, markChannel, toggleChecklistItem, reload } =
    useShareState(draftId);

  const [igOpen, setIgOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [imagesBusy, setImagesBusy] = useState(false);

  /** Caption selection. The value itself is the source for every channel. */
  const [language, setLanguage] = useState<CaptionLanguage>("en");
  const [tone, setTone] = useState<CaptionTone>("friendly");
  const [edits, setEdits] = useState<Record<string, string>>({});

  const summary = shareState.state === "error" ? shareState.summary : shareState.summary;

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

  const authoredCaption = summary ? summary.captions[language][tone] : "";
  const editKey = `${language}:${tone}`;
  /** Edits are kept per language and tone, so switching back restores the edit. */
  const caption = edits[editKey] ?? authoredCaption;

  const handleCaptionChange = useCallback(
    (value: string) => {
      setEdits((prev) => ({ ...prev, [editKey]: value }));
    },
    [editKey],
  );

  const handleRestoreCaption = useCallback(() => {
    setEdits((prev) => {
      const next = { ...prev };
      delete next[editKey];
      return next;
    });
  }, [editKey]);

  const storyData: StoryRenderData | null = useMemo(() => {
    if (!summary) return null;
    return {
      shopName: summary.shopName,
      productTitle: summary.product.title,
      price: formatMoney(
        { amountMinor: summary.product.priceMinor, currency: summary.product.currency },
        locale,
      ),
      linkText: `${summary.shopHost}${summary.shopSlug}`,
      shopUrl: summary.shopUrl,
      paymentNote: t("story.imageNote"),
      scanLabel: t("story.scanLabel"),
    };
  }, [summary, locale, t]);

  /**
   * Open a share intent in a new tab.
   *
   * A blocked popup means the composer never opened, which is the error state —
   * it is not something to fail silently on the seller's first attempt.
   */
  const openIntent = useCallback(
    (url: string, channel: ShareChannel) => {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) {
        dispatch({ type: "SHARE_FAILED", message: "" });
        return;
      }
      markChannel(channel);
    },
    [dispatch, markChannel],
  );

  const downloadStory = useCallback(async () => {
    if (!storyData || !summary) return;
    setImagesBusy(true);
    try {
      const blob = await storyBlob(storyData);
      const filename = `solai-${summary.shopSlug}-status.png`;

      // On Android this hands the picture straight to WhatsApp. It is an
      // enhancement: the download path below is the default everywhere else.
      const file = blobToFile(blob, filename);
      if (canShareFiles([file])) {
        const outcome = await shareFiles({
          title: summary.shopName,
          text: caption,
          files: [file],
        });
        if (outcome === "shared") {
          markChannel("story");
          toast(t("toast.statusShared"));
          return;
        }
        if (outcome === "cancelled") return;
      }

      downloadBlob(blob, filename);
      markChannel("story");
      toast(t("toast.statusSaved"));
    } catch {
      toast(t("toast.imageFailed"));
    } finally {
      setImagesBusy(false);
    }
  }, [storyData, summary, caption, markChannel, toast, t]);

  const downloadPack = useCallback(async () => {
    if (!storyData || !summary) return;
    setImagesBusy(true);
    try {
      const blobs = await packBlobs(storyData);
      // Staggered: browsers block a burst of same-tick downloads.
      for (let i = 0; i < blobs.length; i += 1) {
        const blob = blobs[i];
        if (!blob) continue;
        downloadBlob(blob, `solai-${summary.shopSlug}-${i + 1}.png`);
        if (i < blobs.length - 1) await delay(PACK_DOWNLOAD_STAGGER_MS);
      }
      toast(t("toast.packSaved"));
    } catch {
      toast(t("toast.imageFailed"));
    } finally {
      setImagesBusy(false);
    }
  }, [storyData, summary, toast, t]);

  const handleSelectChannel = useCallback(
    (channel: ShareChannel) => {
      if (!summary) return;
      const url = summary.shopUrl;

      switch (channel) {
        case "fb":
          openIntent(facebookUrl(url, caption), "fb");
          return;
        case "tg":
          openIntent(telegramUrl(url, caption), "tg");
          return;
        case "x":
          openIntent(tweetUrl(caption), "x");
          return;
        case "sms":
          openIntent(smsUrl(caption), "sms");
          return;
        case "mail":
          openIntent(emailUrl(emailSubject(summary.shopName), caption), "mail");
          return;
        case "ig":
          // Never a fake composer: the hand-off sheet does the real work.
          setIgOpen(true);
          return;
        case "qr":
          setQrOpen(true);
          markChannel("qr");
          return;
        case "link": {
          void copyText(url).then((outcome) => {
            toast(outcome === "copied" ? t("toast.linkCopied") : t("toast.copyFailed"));
            if (outcome === "copied") markChannel("link");
          });
          return;
        }
        case "more": {
          void nativeShare({ title: summary.shopName, text: caption, url }).then((outcome) => {
            if (outcome === "shared") {
              markChannel("more");
              return;
            }
            if (outcome === "unsupported") {
              void copyText(caption).then((copied) => {
                toast(copied === "copied" ? t("toast.noShareMenu") : t("toast.copyFailed"));
                if (copied === "copied") markChannel("more");
              });
            }
            // A cancel is the seller changing their mind, not a failure.
          });
          return;
        }
        default:
          return;
      }
    },
    [summary, caption, openIntent, markChannel, toast, t],
  );

  const countLabel =
    sharedCount === 0
      ? t("action.countNone")
      : sharedCount === 1
        ? t("action.countOne")
        : t("action.countMany", { count: sharedCount });

  const skipHref = `/build/${draftId}/live`;

  return (
    <div className="build-app-shell mx-auto flex min-h-screen w-full max-w-[1440px] flex-col bg-paper">
      <LiveTopBar
        activeStep={5}
        stepLabels={stepLabels}
        stepperLabels={stepperLabels}
        backHref={`/build/${draftId}/live`}
        backLabel={t("topbar.back")}
        liveChip={summary ? t("topbar.liveChip") : undefined}
        progressPct={SHARE_PROGRESS[shareState.state]}
      />

      <PanelErrorBoundary retryLabel={t("error.backToSharing")} title={t("error.panel")}>
        {!loadSettled ? (
          <div className="flex flex-1 items-center justify-center px-3.5 py-16" aria-busy="true">
            <p className="text-sm text-ink-45">{t("loading")}</p>
          </div>
        ) : null}

        {loadSettled && shareState.state === "share" && storyData ? (
          <ShareState
            t={t}
            tRich={(key) =>
              t.rich(key, {
                highlight: (chunks) => <span className="mark-line">{chunks}</span>,
                strong: (chunks) => <span className="font-bold text-ink">{chunks}</span>,
              })
            }
            summary={shareState.summary}
            checklist={shareState.checklist}
            sharedChannels={sharedChannels}
            caption={caption}
            authoredCaption={authoredCaption}
            language={language}
            tone={tone}
            storyData={storyData}
            imagesBusy={imagesBusy}
            onCaptionChange={handleCaptionChange}
            onLanguageChange={setLanguage}
            onToneChange={setTone}
            onRestoreCaption={handleRestoreCaption}
            onSendToChat={() => openIntent(whatsappUrl(caption), "wa")}
            onPostAsStatus={() => void downloadStory()}
            onSelectChannel={handleSelectChannel}
            onMarkChannel={markChannel}
            onToggleChecklist={(id, checked) => void toggleChecklistItem(id, checked)}
            onDownloadStory={() => void downloadStory()}
            onDownloadPack={() => void downloadPack()}
            onToast={toast}
            storefrontHref={inAppShopPath(shareState.summary.shopSlug)}
          />
        ) : null}

        {loadSettled && shareState.state === "done" ? (
          <SharedDoneState
            t={t}
            catalogueHref="/dashboard/grow"
            addProductHref="/start"
            reachHref="/dashboard/grow/boost"
            shopHomeHref="/dashboard"
          />
        ) : null}

        {loadSettled && shareState.state === "error" ? (
          <ShareErrorState
            t={t}
            message={shareState.message || (shareState.summary ? undefined : t("error.loadLede"))}
            title={shareState.summary ? undefined : t("error.loadTitle")}
            shopUrl={shareState.summary?.shopUrl ?? null}
            onBack={() => {
              if (shareState.summary) {
                dispatch({ type: "BACK_TO_SHARE" });
                return;
              }
              void reload();
            }}
            backLabel={shareState.summary ? t("error.backToSharing") : t("error.retry")}
            onToast={toast}
          />
        ) : null}
      </PanelErrorBoundary>

      {loadSettled && shareState.state === "share" ? (
        <ShareActionBar
          countLabel={countLabel}
          skipLabel={t("action.skip")}
          doneLabel={t("action.done")}
          skipHref={skipHref}
          onDone={() => dispatch({ type: "MARK_DONE" })}
        />
      ) : null}

      {summary ? (
        <>
          <InstagramHandoffSheet
            open={igOpen}
            onOpenChange={setIgOpen}
            t={t}
            caption={caption}
            shopUrl={summary.shopUrl}
            imagesBusy={imagesBusy}
            onSaveImages={() => {
              void (async () => {
                await downloadPack();
                await downloadStory();
              })();
            }}
            onOpenInstagram={() => {
              markChannel("ig");
              setIgOpen(false);
              window.open(instagramUrl(), "_blank", "noopener,noreferrer");
            }}
            onToast={toast}
          />

          <QrSheet
            open={qrOpen}
            onOpenChange={setQrOpen}
            t={t}
            shopUrl={summary.shopUrl}
            slug={summary.shopSlug}
            host={summary.shopHost}
            onToast={toast}
          />
        </>
      ) : null}
    </div>
  );
}
