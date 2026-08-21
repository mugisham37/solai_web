"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CopyButton } from "@/components/atoms/CopyButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { QrCode } from "@/components/atoms/QrCode";
import { Text } from "@/components/atoms/Text";
import { CaptionComposer } from "@/components/molecules/CaptionComposer";
import { ChannelGrid } from "@/components/molecules/ChannelGrid";
import { FirstFiveChecklist } from "@/components/molecules/FirstFiveChecklist";
import { StoryPreview } from "@/components/molecules/StoryPreview";
import { WhatsAppCard } from "@/components/molecules/WhatsAppCard";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import { isExternalHref } from "@/lib/buyer/paths";
import type { StoryRenderData } from "@/lib/share/story-renderer";
import type {
  CaptionLanguage,
  CaptionTone,
  ChecklistId,
  ChecklistState,
  ShareChannel,
  ShareSummary,
} from "@/types/share";

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type ShareStateProps = {
  t: TranslateFn;
  tRich: (key: string) => ReactNode;
  summary: ShareSummary;
  checklist: ChecklistState;
  sharedChannels: ReadonlySet<ShareChannel>;
  caption: string;
  authoredCaption: string;
  language: CaptionLanguage;
  tone: CaptionTone;
  storyData: StoryRenderData;
  imagesBusy: boolean;
  onCaptionChange: (value: string) => void;
  onLanguageChange: (language: CaptionLanguage) => void;
  onToneChange: (tone: CaptionTone) => void;
  onRestoreCaption: () => void;
  onSendToChat: () => void;
  onPostAsStatus: () => void;
  onSelectChannel: (channel: ShareChannel) => void;
  /** Records a channel as used without re-running its action. */
  onMarkChannel: (channel: ShareChannel) => void;
  onToggleChecklist: (id: ChecklistId, checked: boolean) => void;
  onDownloadStory: () => void;
  onDownloadPack: () => void;
  onToast: (message: string) => void;
  storefrontHref: string;
};

export function ShareState({
  t,
  tRich,
  summary,
  checklist,
  sharedChannels,
  caption,
  authoredCaption,
  language,
  tone,
  storyData,
  imagesBusy,
  onCaptionChange,
  onLanguageChange,
  onToneChange,
  onRestoreCaption,
  onSendToChat,
  onPostAsStatus,
  onSelectChannel,
  onMarkChannel,
  onToggleChecklist,
  onDownloadStory,
  onDownloadPack,
  onToast,
  storefrontHref,
}: ShareStateProps) {
  const reduceMotion = useReducedMotion();
  const linkText = `${summary.shopHost}${summary.shopSlug}`;

  return (
    <motion.section
      className="flex flex-1 flex-col gap-4 px-3.5 py-4 md:px-6 md:py-8 @[1000px]:gap-5 @[1000px]:p-9"
      aria-label={t("header.eyebrow")}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <header>
        <Eyebrow>{t("header.eyebrow")}</Eyebrow>
        <Heading level={1} size="display" className="mt-2 text-d1">
          {tRich("header.title")}
        </Heading>
        <Text className="mt-1.5 max-w-[56ch] text-ink-70">{t("header.lede")}</Text>
      </header>

      <div className="grid items-start gap-5 @[1000px]:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] @[1000px]:gap-8">
        {/* Left rail: where the message goes, and what it says. WhatsApp leads
            because it is what actually works here. */}
        <div className="flex flex-col gap-3.5">
          <WhatsAppCard
            labels={{
              title: t("whatsapp.title"),
              subtitle: t("whatsapp.subtitle"),
              chatAction: t("whatsapp.chatAction"),
              statusAction: t("whatsapp.statusAction"),
              hint: t("whatsapp.hint"),
            }}
            onSendToChat={onSendToChat}
            onPostAsStatus={onPostAsStatus}
            statusBusy={imagesBusy}
          />

          <ChannelGrid
            eyebrow={t("channels.eyebrow")}
            channelLabels={{
              wa: t("channels.wa"),
              story: t("channels.story"),
              fb: t("channels.fb"),
              ig: t("channels.ig"),
              tg: t("channels.tg"),
              x: t("channels.x"),
              sms: t("channels.sms"),
              mail: t("channels.mail"),
              link: t("channels.link"),
              qr: t("channels.qr"),
              more: t("channels.more"),
            }}
            sharedLabel={t("channels.sharedState")}
            hint={t("channels.hint")}
            sharedChannels={sharedChannels}
            onSelect={onSelectChannel}
          />

          <CaptionComposer
            value={caption}
            authoredValue={authoredCaption}
            language={language}
            tone={tone}
            labels={{
              eyebrow: t("caption.eyebrow"),
              textareaLabel: t("caption.textareaLabel"),
              languageGroupLabel: t("caption.languageGroupLabel"),
              languageNames: { en: t("caption.languageEn"), rw: t("caption.languageRw") },
              rewriteAs: t("caption.rewriteAs"),
              toneNames: {
                friendly: t("caption.toneFriendly"),
                short: t("caption.toneShort"),
                offer: t("caption.toneOffer"),
              },
              aiBadge: t("caption.aiBadge"),
              restore: t("caption.restore"),
              copy: t("caption.copy"),
              copySuccess: t("toast.captionCopied"),
              copyFailure: t("toast.copyFailed"),
              hint: t("caption.hint"),
            }}
            onValueChange={onCaptionChange}
            onLanguageChange={onLanguageChange}
            onToneChange={onToneChange}
            onRestore={onRestoreCaption}
            onToast={onToast}
          />
        </div>

        {/* Right rail: who to tell, and the assets to tell them with. */}
        <div className="flex flex-col gap-3.5">
          <FirstFiveChecklist
            checklist={checklist}
            labels={{
              eyebrow: t("checklist.eyebrow"),
              meterLabel: t("checklist.meterLabel"),
              count: t("checklist.count", {
                done: Object.values(checklist).filter(Boolean).length,
                total: 5,
              }),
              items: {
                family: {
                  title: t("checklist.familyTitle"),
                  subtitle: t("checklist.familySub"),
                },
                customer: {
                  title: t("checklist.customerTitle"),
                  subtitle: t("checklist.customerSub"),
                },
                group: {
                  title: t("checklist.groupTitle"),
                  subtitle: t("checklist.groupSub"),
                },
                reposter: {
                  title: t("checklist.reposterTitle"),
                  subtitle: t("checklist.reposterSub"),
                },
                status: {
                  title: t("checklist.statusTitle"),
                  subtitle: t("checklist.statusSub"),
                },
              },
              note: t("checklist.note"),
              complete: t("checklist.complete"),
            }}
            onToggle={onToggleChecklist}
          />

          <StoryPreview
            data={storyData}
            labels={{
              eyebrow: t("story.eyebrow"),
              description: t("story.description"),
              download: t("story.download"),
              pack: t("story.pack"),
              hint: t("story.hint"),
            }}
            onDownloadStory={onDownloadStory}
            onDownloadPack={onDownloadPack}
            busy={imagesBusy}
          />

          <section className="rounded-card border border-hair bg-white p-4">
            <Eyebrow variant="quiet" className="mb-3">
              {t("qr.eyebrow")}
            </Eyebrow>

            <div className="grid place-items-center rounded-tile border border-hair bg-white p-3">
              <QrCode
                url={summary.shopUrl}
                label={t("qr.alt", { url: linkText })}
                size={190}
                className="max-w-full"
              />
            </div>

            {/* The link stays selectable text — a QR is never the only way through. */}
            <p className="mt-3 break-all text-center font-display text-base font-bold">
              {linkText}
            </p>

            <div className="mt-2.5 flex flex-wrap justify-center gap-2">
              <CopyButton
                text={summary.shopUrl}
                label={t("qr.copy")}
                successMessage={t("toast.linkCopied")}
                failureMessage={t("toast.copyFailed")}
                onResult={onToast}
                onCopied={() => onMarkChannel("link")}
              />

              <a
                href={storefrontHref}
                {...(isExternalHref(storefrontHref)
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill border border-ink-20 px-3.5 py-2 text-[0.82rem] font-bold transition-colors hover:bg-paper-2"
              >
                <Icon name="eye" size="sm" />
                {t("qr.preview")}
              </a>
            </div>
          </section>
        </div>
      </div>
    </motion.section>
  );
}
