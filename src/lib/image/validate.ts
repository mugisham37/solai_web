const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const HEIC_TYPES = new Set(["image/heic", "image/heif"]);

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 12 * 1024 * 1024;

export type FileValidationResult =
  | { ok: true; file: File; isHeic: boolean }
  | { ok: false; fileName: string; message: string };

export function isHeicFile(file: File): boolean {
  if (HEIC_TYPES.has(file.type)) return true;
  const name = file.name.toLowerCase();
  return name.endsWith(".heic") || name.endsWith(".heif");
}

export function validateImageFile(file: File): FileValidationResult {
  const isHeic = isHeicFile(file);
  const typeOk = ACCEPTED.has(file.type) || isHeic;
  if (!typeOk) {
    return {
      ok: false,
      fileName: file.name,
      message: `${file.name} is not supported. Use JPG, PNG, WebP or HEIC.`,
    };
  }
  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      fileName: file.name,
      message: `${file.name} is too large. Maximum size is 12 MB.`,
    };
  }
  return { ok: true, file, isHeic };
}

export function validateImageFiles(files: FileList | File[]): {
  accepted: FileValidationResult[];
  rejected: FileValidationResult[];
} {
  const list = Array.from(files).slice(0, MAX_FILES);
  const accepted: FileValidationResult[] = [];
  const rejected: FileValidationResult[] = [];
  for (const file of list) {
    const result = validateImageFile(file);
    if (result.ok) accepted.push(result);
    else rejected.push(result);
  }
  return { accepted, rejected };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
