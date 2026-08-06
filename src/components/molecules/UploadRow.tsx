import { ProgressBar } from "@/components/atoms/ProgressBar";
import { Chip } from "@/components/atoms/Chip";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import type { UploadingFile } from "@/types/build";

type UploadRowProps = {
  file: UploadingFile;
  sizeLabel: string;
  sentLabel: string;
  retryLabel: string;
  onRetry?: () => void;
};

export function UploadRow({ file, sizeLabel, sentLabel, retryLabel, onRetry }: UploadRowProps) {
  return (
    <div className="flex items-center gap-3 border-t border-hair py-3 first:border-t-0">
      <span className="size-[46px] shrink-0 overflow-hidden rounded-[11px] bg-paper-2">
        {file.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.previewUrl} alt="" className="size-full object-cover" />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{file.fileName}</span>
        <span className="block text-xs text-ink-45">{sizeLabel}</span>
        <ProgressBar
          className="mt-1"
          value={file.status === "done" ? 100 : file.progress}
          done={file.status === "done"}
        />
      </span>
      {file.status === "done" ? (
        <Chip variant="live">{sentLabel}</Chip>
      ) : file.status === "failed" ? (
        <ActionButton type="button" variant="line" size="sm" onClick={onRetry}>
          <Icon name="refresh" size="sm" />
          {retryLabel}
        </ActionButton>
      ) : (
        <span className="text-xs text-ink-45">{file.status === "uploading" ? `${file.progress}%` : "…"}</span>
      )}
    </div>
  );
}
