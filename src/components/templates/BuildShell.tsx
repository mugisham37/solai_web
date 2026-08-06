"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { BuildTopBar } from "@/components/organisms/BuildTopBar";
import { CaptureState } from "@/components/organisms/CaptureState";
import { UploadState } from "@/components/organisms/UploadState";
import { GeneratingState } from "@/components/organisms/GeneratingState";
import { DraftEditor } from "@/components/organisms/DraftEditor";
import { UnclearState } from "@/components/organisms/UnclearState";
import { BlockedState } from "@/components/organisms/BlockedState";
import { ErrorState } from "@/components/organisms/ErrorState";
import { PriceReasoningSheet } from "@/components/organisms/PriceReasoningSheet";
import { SaveAndExitSheet } from "@/components/organisms/SaveAndExitSheet";
import { BUILD_STEPS } from "@/data/build";
import { useBuildState } from "@/hooks/useBuildState";
import { useImagePipeline } from "@/hooks/useImagePipeline";
import { useAutosave, loadSessionFromIdb, saveSessionToIdb } from "@/hooks/useAutosave";
import { getGenerationService } from "@/lib/generation";
import { saveDraftMemory } from "@/lib/draft-store";
import type { GenerationStageStatus, Tone, UploadingFile } from "@/types/build";

const PROGRESS: Record<string, number> = {
  capture: 28,
  uploading: 34,
  generating: 40,
  draft: 46,
  unclear: 34,
  blocked: 34,
  error: 34,
};

type BuildShellProps = {
  draftId: string;
  initialQuery?: string;
};

export function BuildShell({ draftId, initialQuery }: BuildShellProps) {
  const t = useTranslations("build");
  const tCommon = useTranslations("common");
  /** `BUILD_STEPS` carries fully-qualified keys, so the step labels resolve from the root. */
  const tRoot = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = initialQuery ?? searchParams.get("q") ?? "";

  const { buildState, allowanceRemaining, dispatch } = useBuildState(q || undefined);
  const [description, setDescription] = useState(q);
  const [uploadFiles, setUploadFiles] = useState<UploadingFile[]>([]);
  const [originalMeta, setOriginalMeta] = useState({ title: "", priceMinor: 8500 });
  const [priceSheetOpen, setPriceSheetOpen] = useState(false);
  const [exitSheetOpen, setExitSheetOpen] = useState(false);
  const [exitPhone, setExitPhone] = useState("");
  const genAbort = useRef<AbortController | null>(null);
  const imageUrlsRef = useRef<string[]>([]);
  const [landedUrlCount, setLandedUrlCount] = useState(0);
  const restored = useRef(false);

  const draft = buildState.state === "draft" ? buildState.draft : null;

  const { status: autosaveStatus, saveOnBlur } = useAutosave({
    draftId,
    draft,
    buildState,
    allowanceRemaining,
  });

  const onFileUpdate = useCallback(
    (file: UploadingFile) => {
      setUploadFiles((prev) => {
        const idx = prev.findIndex((f) => f.id === file.id);
        const next = idx === -1 ? [...prev, file] : prev.map((f) => (f.id === file.id ? file : f));
        if (prev.length === 0 && idx === -1) {
          dispatch({ type: "ACCEPT_FILES", files: [file] });
        } else {
          dispatch({ type: "UPDATE_FILE", file });
        }
        return next;
      });
    },
    [dispatch],
  );

  const runGenerationRef = useRef<(urls: string[], hint?: string) => Promise<void>>(async () => {});

  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    void (async () => {
      const session = await loadSessionFromIdb(draftId);
      if (session) {
        dispatch({ type: "RESTORE_SESSION", buildState: session.buildState, allowanceRemaining: session.allowanceRemaining });
        if (session.buildState.state === "draft") {
          saveDraftMemory(session.buildState.draft);
        }
      }
    })();
  }, [dispatch, draftId]);

  useEffect(() => {
    void saveSessionToIdb({
      draftId,
      buildState,
      allowanceRemaining,
      autosaveStatus,
    });
  }, [allowanceRemaining, autosaveStatus, buildState, draftId]);

  const stepLabels = useMemo(
    () => Object.fromEntries(BUILD_STEPS.map((s) => [s.labelKey, tRoot(s.labelKey)])),
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

  const runGeneration = useCallback(
    async (urls: string[], hint?: string) => {
      genAbort.current?.abort();
      genAbort.current = new AbortController();
      dispatch({ type: "START_GENERATING", allowanceRemaining });
      const service = getGenerationService();
      const stagesMap = new Map<string, GenerationStageStatus>();

      try {
        const result = await service.analyseAndBuild(
          { imageUrls: urls, hint, descriptionOnly: urls.length === 0 },
          (ev) => {
            if (ev.type === "stage") {
              stagesMap.set(ev.stageId, {
                id: ev.stageId,
                label: ev.label,
                subLabel: ev.subLabel,
                status: "active",
              });
              for (const [id, s] of stagesMap) {
                if (id !== ev.stageId && s.status === "active") {
                  stagesMap.set(id, { ...s, status: "done" });
                }
              }
              dispatch({
                type: "UPDATE_GENERATION",
                stages: [...stagesMap.values()],
                progress: Math.round(((ev.index + 1) / ev.total) * 100),
              });
            }
            if (ev.type === "progress") {
              dispatch({
                type: "UPDATE_GENERATION",
                stages: [...stagesMap.values()],
                progress: ev.progress,
              });
            }
            if (ev.type === "allowance") {
              /* allowance from server */
            }
          },
          genAbort.current.signal,
        );

        if (result.outcome === "draft") {
          const merged = { ...result.draft, id: draftId };
          saveDraftMemory(merged);
          setOriginalMeta({
            title: merged.title.en ?? "",
            priceMinor: merged.price.amountMinor,
          });
          dispatch({ type: "GENERATION_COMPLETE", draft: merged });
        } else if (result.outcome === "unclear") {
          dispatch({
            type: "GENERATION_UNCLEAR",
            imageUrl: result.imageUrl,
            issues: result.issues,
          });
        } else if (result.outcome === "blocked") {
          dispatch({ type: "GENERATION_BLOCKED", reason: result.reason, rule: result.rule });
        } else {
          dispatch({
            type: "GENERATION_ERROR",
            message: result.message,
            canRetry: true,
            chargedAllowance: result.chargedAllowance,
          });
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        dispatch({
          type: "GENERATION_ERROR",
          message: t("error.lede"),
          canRetry: true,
          chargedAllowance: false,
        });
      }
    },
    [allowanceRemaining, dispatch, draftId, t],
  );

  useEffect(() => {
    runGenerationRef.current = runGeneration;
  }, [runGeneration]);

  const { processQueue, formatSaving } = useImagePipeline({
    draftId,
    onFileUpdate,
    onFirstLanded: (url) => {
      imageUrlsRef.current = [...imageUrlsRef.current, url];
      setLandedUrlCount(imageUrlsRef.current.length);
      void runGenerationRef.current([...imageUrlsRef.current], description);
    },
  });

  const handleFiles = (files: File[]) => {
    void processQueue(files);
  };

  const handleDescribeOnly = () => {
    dispatch({ type: "START_UPLOADING", descriptionOnly: true });
    void runGeneration([], description);
  };

  const progressPct = PROGRESS[buildState.state] ?? 40;

  return (
    <div className="build-app-shell mx-auto flex min-h-screen w-full max-w-[1440px] flex-col bg-paper">
      <BuildTopBar
        stepLabels={stepLabels}
        stepperLabels={stepperLabels}
        autosaveStatus={autosaveStatus}
        autosaveSaved={t("topbar.saved")}
        autosaveSaving={t("topbar.saving")}
        autosaveOffline={t("topbar.offline")}
        saveExitLabel={t("topbar.saveExit")}
        onSaveExit={() => setExitSheetOpen(true)}
        progressPct={progressPct}
      />

      {buildState.state === "capture" ? (
        <CaptureState
          t={t}
          description={description}
          onDescriptionChange={setDescription}
          onFiles={handleFiles}
          onDescribeSubmit={handleDescribeOnly}
        />
      ) : null}

      {buildState.state === "uploading" ? (
        <UploadState
          t={t}
          files={uploadFiles.length ? uploadFiles : buildState.files}
          sizeLabel={(f) =>
            f.compressedFileSize
              ? formatSaving(f.originalFileSize, f.compressedFileSize)
              : formatSaving(f.originalFileSize)
          }
          onRetry={() => {}}
          onAddPhoto={() => dispatch({ type: "GO_CAPTURE" })}
          onStartBuild={() => void runGeneration(imageUrlsRef.current, description)}
          canStart={buildState.canStartGeneration || landedUrlCount > 0}
        />
      ) : null}

      {buildState.state === "generating" ? (
        <GeneratingState
          t={t}
          stages={buildState.stages}
          progress={buildState.progress}
          liveMessage={buildState.stages.find((s) => s.status === "active")?.label ?? ""}
          onCancel={() => dispatch({ type: "GO_CAPTURE" })}
        />
      ) : null}

      {buildState.state === "draft" ? (
        <DraftEditor
          t={t}
          draft={buildState.draft}
          allowanceRemaining={allowanceRemaining}
          onDraftChange={(d) => {
            saveDraftMemory(d);
            dispatch({ type: "UPDATE_DRAFT", draft: d });
          }}
          onBlurSave={saveOnBlur}
          onWhyPrice={() => setPriceSheetOpen(true)}
          onRewriteTone={async (tone: Tone) => {
            const service = getGenerationService();
            const res = await service.rewriteDescription({
              draft: buildState.draft,
              tone,
              locale: "en",
            });
            dispatch({
              type: "UPDATE_DRAFT",
              draft: {
                ...buildState.draft,
                description: res.description,
                updatedAt: new Date().toISOString(),
              },
            });
          }}
          originalTitle={originalMeta.title}
          originalPriceMinor={originalMeta.priceMinor}
          onRebuild={() => void runGeneration(imageUrlsRef.current, description)}
          onContinue={() => {
            router.push(`/build/${draftId}/payout`);
          }}
          autosaveStatus={autosaveStatus}
          onAddPhoto={() => dispatch({ type: "GO_CAPTURE" })}
        />
      ) : null}

      {buildState.state === "unclear" ? (
        <UnclearState
          t={t}
          imageUrl={buildState.imageUrl}
          issues={buildState.issues}
          hint={buildState.hint}
          onHintChange={(hint) => dispatch({ type: "SET_UNCLEAR_HINT", hint })}
          onBuild={() => void runGeneration(imageUrlsRef.current, buildState.hint)}
          onRetake={() => dispatch({ type: "GO_CAPTURE" })}
        />
      ) : null}

      {buildState.state === "blocked" ? (
        <BlockedState
          t={t}
          reason={buildState.reason}
          rule={buildState.rule}
          options={buildState.options}
          onListOther={() => dispatch({ type: "GO_CAPTURE" })}
        />
      ) : null}

      {buildState.state === "error" ? (
        <ErrorState
          t={t}
          message={buildState.message}
          canRetry={buildState.canRetry}
          chargedAllowance={buildState.chargedAllowance}
          onRetry={() => void runGeneration(imageUrlsRef.current, description)}
          onBack={() => dispatch({ type: "GO_CAPTURE" })}
        />
      ) : null}

      {draft ? (
        <PriceReasoningSheet
          open={priceSheetOpen}
          onOpenChange={setPriceSheetOpen}
          t={t}
          price={draft.price}
        />
      ) : null}

      <SaveAndExitSheet
        open={exitSheetOpen}
        onOpenChange={setExitSheetOpen}
        t={t}
        phone={exitPhone}
        onPhoneChange={setExitPhone}
        onSendLink={() => setExitSheetOpen(false)}
      />
    </div>
  );
}
