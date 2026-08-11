"use client";

import { AutosaveIndicator } from "@/components/atoms/AutosaveIndicator";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import type { AutosaveStatus } from "@/types/build";

type DraftActionBarProps = {
  t: (key: string) => string;
  autosaveStatus: AutosaveStatus;
  onRebuild: () => void;
  onContinue: () => void;
};

export function DraftActionBar({ t, autosaveStatus, onRebuild, onContinue }: DraftActionBarProps) {
  return (
    <div className="sticky bottom-0 z-25 border-t border-hair bg-paper/95 pb-[calc(0.7rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
      <div className="flex items-center gap-2 px-3.5 md:px-6">
        <AutosaveIndicator
          status={autosaveStatus}
          savedLabel={t("action.saved")}
          savingLabel={t("action.saving")}
          offlineLabel={t("action.offline")}
        />
        <span className="flex-1" />
        <ActionButton type="button" variant="line" onClick={onRebuild} className="shrink-0">
          <Icon name="refresh" />
          <span className="sr-only">{t("draft.buildAgain")}</span>
          {t("action.again")}
        </ActionButton>
        <ActionButton
          type="button"
          variant="sun"
          size="lg"
          onClick={onContinue}
          className="min-w-0 flex-1 @[700px]:ml-auto @[700px]:w-[280px] @[700px]:flex-none"
        >
          {t("action.continue")}
          <Icon name="arrowRight" />
        </ActionButton>
      </div>
    </div>
  );
}
